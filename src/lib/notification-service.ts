import { prisma } from './prisma';
import { EmailService } from './email-service';

export interface CreateNotificationOptions {
  userId: string;
  type: 
    | 'NEW_LISTING' 
    | 'BOOKING_CONFIRMED' 
    | 'BOOKING_REQUEST' 
    | 'ALERT_MATCH' 
    | 'CONTACT_FORM' 
    | 'SYSTEM' 
    | 'SECURITY';
  title: {
    en: string;
    bg?: string;
    ru?: string;
  };
  message: {
    en: string;
    bg?: string;
    ru?: string;
  };
  data?: any;
  sendEmail?: boolean;
}

export class NotificationService {
  static async createNotification(options: CreateNotificationOptions) {
    const { userId, type, title, message, data, sendEmail = true } = options;

    try {
      // Check user preferences
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true, lastName: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Create notification
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data,
        }
      });

      // Send email if enabled and user has preferences
      if (sendEmail && preferences?.emailNotifications) {
        // Check specific notification type preferences
        let shouldSendEmail = false;
        
        switch (type) {
          case 'NEW_LISTING':
            shouldSendEmail = preferences.notifyNewListings;
            break;
          case 'BOOKING_CONFIRMED':
          case 'BOOKING_REQUEST':
            shouldSendEmail = preferences.notifyBookings;
            break;
          case 'ALERT_MATCH':
            shouldSendEmail = preferences.notifyAlerts;
            break;
          case 'CONTACT_FORM':
            shouldSendEmail = preferences.notifyMessages;
            break;
          case 'SYSTEM':
          case 'SECURITY':
            shouldSendEmail = true;
            break;
        }

        if (shouldSendEmail) {
          try {
            // Send email notification
            await EmailService.sendNotificationEmail({
              to: user.email,
              subject: title.en,
              message: message.en,
              type
            });

            // Update notification with email sent status
            await prisma.notification.update({
              where: { id: notification.id },
              data: { emailSent: true }
            });
          } catch (emailError) {
    
          }
        }
      }

      return notification;
    } catch (error) {

      throw error;
    }
  }

  static async createMultipleNotifications(notifications: CreateNotificationOptions[]) {
    const results = await Promise.allSettled(
      notifications.map(notification => this.createNotification(notification))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { successful, failed, results };
  }

  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  static async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, updatedAt: new Date() }
    });

    return result.count;
  }

  static async deleteOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true
      }
    });

    return result.count;
  }

  // Specific notification helpers
  static async notifyNewListing(userId: string, listingData: any) {
    return this.createNotification({
      userId,
      type: 'NEW_LISTING',
      title: {
        en: 'New Property Listed',
        bg: 'Ново Имот Обявен',
        ru: 'Новая Недвижимость Добавлена'
      },
      message: {
        en: `A new property has been listed: ${listingData.title?.en || 'New Property'}`,
        bg: `Нов имот е обявен: ${listingData.title?.bg || 'Нов Имот'}`,
        ru: `Добавлена новая недвижимость: ${listingData.title?.ru || 'Новая Недвижимость'}`
      },
      data: { listingId: listingData.id, title: listingData.title }
    });
  }

  static async notifyBookingConfirmed(userId: string, bookingData: any) {
    return this.createNotification({
      userId,
      type: 'BOOKING_CONFIRMED',
      title: {
        en: 'Booking Confirmed',
        bg: 'Резервацията е Потвърдена',
        ru: 'Бронирование Подтверждено'
      },
      message: {
        en: `Your booking for ${bookingData.listing?.title?.en || 'the property'} has been confirmed`,
        bg: `Вашата резервация за ${bookingData.listing?.title?.bg || 'имота'} е потвърдена`,
        ru: `Ваше бронирование ${bookingData.listing?.title?.ru || 'недвижимости'} подтверждено`
      },
      data: { bookingId: bookingData.id, listing: bookingData.listing }
    });
  }

  static async notifyBookingRequest(userId: string, bookingData: any) {
    return this.createNotification({
      userId,
      type: 'BOOKING_REQUEST',
      title: {
        en: 'New Booking Request',
        bg: 'Нова Заявка за Резервация',
        ru: 'Новый Запрос на Бронирование'
      },
      message: {
        en: `You have a new booking request for ${bookingData.listing?.title?.en || 'your property'}`,
        bg: `Имате нова заявка за резервация на ${bookingData.listing?.title?.bg || 'вашия имот'}`,
        ru: `У вас новый запрос на бронирование ${bookingData.listing?.title?.ru || 'вашей недвижимости'}`
      },
      data: { bookingId: bookingData.id, listing: bookingData.listing }
    });
  }

  static async notifyAlertMatch(userId: string, alertData: any, listingsCount: number) {
    return this.createNotification({
      userId,
      type: 'ALERT_MATCH',
      title: {
        en: 'New Properties Match Your Alert',
        bg: 'Нови Имоти Съответстват на Вашето Известие',
        ru: 'Новые Недвижимости Соответствуют Вашему Оповещению'
      },
      message: {
        en: `${listingsCount} new properties match your alert: ${alertData.name}`,
        bg: `${listingsCount} нови имота съответстват на вашето известие: ${alertData.name}`,
        ru: `${listingsCount} новых недвижимостей соответствует вашему оповещению: ${alertData.name}`
      },
      data: { alertId: alertData.id, count: listingsCount, name: alertData.name }
    });
  }
}