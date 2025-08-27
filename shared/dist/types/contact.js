"use strict";
/**
 * Contact form and newsletter subscription types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactCategory = exports.ContactLanguage = void 0;
/**
 * Supported languages for contact forms and subscriptions
 */
var ContactLanguage;
(function (ContactLanguage) {
    ContactLanguage["EN"] = "en";
    ContactLanguage["BG"] = "bg";
    ContactLanguage["RU"] = "ru";
})(ContactLanguage || (exports.ContactLanguage = ContactLanguage = {}));
/**
 * Contact form categories for filtering
 */
var ContactCategory;
(function (ContactCategory) {
    ContactCategory["GENERAL"] = "general";
    ContactCategory["LISTING_INQUIRY"] = "listing_inquiry";
    ContactCategory["AGENT_INQUIRY"] = "agent_inquiry";
    ContactCategory["TECHNICAL_SUPPORT"] = "technical_support";
    ContactCategory["BUSINESS_PARTNERSHIP"] = "business_partnership";
    ContactCategory["MEDIA_INQUIRY"] = "media_inquiry";
    ContactCategory["CAREERS"] = "careers";
    ContactCategory["FEEDBACK"] = "feedback";
})(ContactCategory || (exports.ContactCategory = ContactCategory = {}));
//# sourceMappingURL=contact.js.map