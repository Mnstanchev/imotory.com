/**
 * Agent-related types for the property platform
 * @module types/agent
 * @description
 * Defines all types related to real estate agents including profiles, metrics,
 * performance tracking, and agent management interfaces.
 */

import { MultilingualText } from './common';

/**
 * Agent performance metrics for rating and statistics
 * @interface AgentMetrics
 * @description Comprehensive performance metrics for evaluating agent effectiveness
 * @property {number} responseRate - Percentage of inquiries responded to within timeframe (0-100)
 * @property {number} averageResponseTime - Average time to respond to inquiries in minutes
 * @property {number} listingsSold - Total number of properties successfully sold
 * @property {number} listingsRented - Total number of properties successfully rented
 * @property {number} averageRating - Average client rating on 1-5 scale
 * @property {number} reviewCount - Total number of client reviews received
 * @property {number} totalListings - Total number of active listings managed
 * @property {number} successfulTransactions - Total successful property transactions
 * @example
 * ```typescript
 * const metrics: AgentMetrics = {
 *   responseRate: 95,
 *   averageResponseTime: 15,
 *   listingsSold: 42,
 *   listingsRented: 18,
 *   averageRating: 4.8,
 *   reviewCount: 127,
 *   totalListings: 15,
 *   successfulTransactions: 60
 * };
 * ```
 */
export interface AgentMetrics {
  responseRate: number; // percentage 0-100
  averageResponseTime: number; // in minutes
  listingsSold: number;
  listingsRented: number;
  averageRating: number; // 1-5 scale
  reviewCount: number;
  totalListings: number;
  successfulTransactions: number;
}

/**
 * Real estate agent profile
 * @interface Agent
 * @description Complete agent profile with contact information, specializations, and performance data
 * @property {string} id - Unique identifier for the agent
 * @property {string} firstName - Agent's first name
 * @property {string} lastName - Agent's last name
 * @property {string} email - Primary contact email address
 * @property {string} phone - Contact phone number
 * @property {string} [avatar] - URL to agent's profile photo (optional)
 * @property {MultilingualText} biography - Multilingual biography and description
 * @property {string[]} specializations - List of property specializations (e.g., ['luxury', 'commercial', 'residential'])
 * @property {string[]} languages - Languages spoken by the agent
 * @property {boolean} isActive - Whether the agent profile is currently active
 * @property {boolean} isVerified - Whether the agent is verified/licensed
 * @property {string} [licenseNumber] - Professional license number (optional)
 * @property {number} experienceYears - Years of real estate experience
 * @property {number} listingsCount - Number of active listings managed
 * @property {AgentMetrics} [performanceMetrics] - Performance statistics and ratings
 * @property {Object} [socialMedia] - Social media profile links
 * @property {string} [socialMedia.facebook] - Facebook profile URL
 * @property {string} [socialMedia.instagram] - Instagram profile URL
 * @property {string} [socialMedia.linkedin] - LinkedIn profile URL
 * @property {Date} createdAt - Profile creation timestamp
 * @property {Date} updatedAt - Last profile update timestamp
 * @example
 * ```typescript
 * const agent: Agent = {
 *   id: 'agent-123',
 *   firstName: 'Maria',
 *   lastName: 'Ivanova',
 *   email: 'maria@example.com',
 *   phone: '+359888123456',
 *   biography: {
 *     en: 'Experienced real estate agent with 8+ years in luxury properties',
 *     bg: 'Опитен имотен агент с 8+ години в луксозни имоти'
 *   },
 *   specializations: ['luxury', 'residential', 'investment'],
 *   languages: ['Bulgarian', 'English', 'Russian'],
 *   isActive: true,
 *   isVerified: true,
 *   licenseNumber: 'RE-2024-001',
 *   experienceYears: 8,
 *   listingsCount: 12,
 *   performanceMetrics: {
 *     responseRate: 98,
 *     averageRating: 4.9,
 *     listingsSold: 45
 *   },
 *   createdAt: new Date('2024-01-15'),
 *   updatedAt: new Date('2024-12-01')
 * };
 * ```
 */
export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  biography: MultilingualText;
  specializations: string[];
  languages: string[];
  isActive: boolean;
  isVerified: boolean;
  licenseNumber?: string;
  experienceYears: number;
  listingsCount: number;
  performanceMetrics?: AgentMetrics;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating new agent profiles
 * @interface CreateAgentInput
 * @description Input structure for creating a new agent profile in the system
 * @property {string} firstName - Agent's first name
 * @property {string} lastName - Agent's last name
 * @property {string} email - Primary contact email address
 * @property {string} phone - Contact phone number
 * @property {string} [avatar] - URL to agent's profile photo (optional)
 * @property {MultilingualText} biography - Multilingual biography and description
 * @property {string[]} specializations - List of property specializations
 * @property {string[]} languages - Languages spoken by the agent
 * @property {string} [licenseNumber] - Professional license number (optional)
 * @property {number} experienceYears - Years of real estate experience
 * @property {Object} [socialMedia] - Social media profile links (optional)
 * @property {string} [socialMedia.facebook] - Facebook profile URL
 * @property {string} [socialMedia.instagram] - Instagram profile URL
 * @property {string} [socialMedia.linkedin] - LinkedIn profile URL
 * @example
 * ```typescript
 * const createAgent: CreateAgentInput = {
 *   firstName: 'Alex',
 *   lastName: 'Petrov',
 *   email: 'alex@example.com',
 *   phone: '+359888654321',
 *   biography: {
 *     en: 'Specializing in commercial real estate and investment properties',
 *     bg: 'Специализиран в търговски имоти и инвестиционни имоти'
 *   },
 *   specializations: ['commercial', 'investment', 'retail'],
 *   languages: ['Bulgarian', 'English'],
 *   experienceYears: 5,
 *   licenseNumber: 'RE-2024-002'
 * };
 * ```
 */
export interface CreateAgentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  biography: MultilingualText;
  specializations: string[];
  languages: string[];
  licenseNumber?: string;
  experienceYears: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Input for updating agent profiles
 * @typedef {Partial<CreateAgentInput>} UpdateAgentInput
 * @description All properties are optional for partial updates to existing agent profiles
 * @example
 * ```typescript
 * const updateAgent: UpdateAgentInput = {
 *   phone: '+359899111222',
 *   biography: {
 *     en: 'Updated bio with new achievements',
 *     bg: 'Обновена биография с нови постижения'
 *   }
 * };
 * ```
 */
export type UpdateAgentInput = Partial<CreateAgentInput>;

/**
 * Agent search filters
 * @interface AgentFilters
 * @description Comprehensive filtering options for agent searches
 * @property {boolean} [isActive] - Filter by active status
 * @property {boolean} [isVerified] - Filter by verification status
 * @property {string[]} [specializations] - Filter by property specializations
 * @property {string[]} [languages] - Filter by languages spoken
 * @property {number} [minExperienceYears] - Minimum years of experience required
 * @property {number} [minRating] - Minimum average rating (1-5 scale)
 * @property {number} [maxRating] - Maximum average rating (1-5 scale)
 * @example
 * ```typescript
 * const filters: AgentFilters = {
 *   isActive: true,
 *   isVerified: true,
 *   specializations: ['luxury', 'residential'],
 *   languages: ['English'],
 *   minExperienceYears: 3,
 *   minRating: 4.5
 * };
 * ```
 */
export interface AgentFilters {
  isActive?: boolean;
  isVerified?: boolean;
  specializations?: string[];
  languages?: string[];
  minExperienceYears?: number;
  minRating?: number;
  maxRating?: number;
}

/**
 * Agent sort options
 * @enum {string} AgentSortOption
 * @description Available sorting options for agent listings
 * @property {string} NAME_ASC - Sort by name in ascending order
 * @property {string} NAME_DESC - Sort by name in descending order
 * @property {string} RATING_ASC - Sort by rating in ascending order
 * @property {string} RATING_DESC - Sort by rating in descending order
 * @property {string} EXPERIENCE_ASC - Sort by experience in ascending order
 * @property {string} EXPERIENCE_DESC - Sort by experience in descending order
 * @property {string} LISTINGS_COUNT_ASC - Sort by listings count in ascending order
 * @property {string} LISTINGS_COUNT_DESC - Sort by listings count in descending order
 */
export enum AgentSortOption {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  RATING_ASC = 'rating_asc',
  RATING_DESC = 'rating_desc',
  EXPERIENCE_ASC = 'experience_asc',
  EXPERIENCE_DESC = 'experience_desc',
  LISTINGS_COUNT_ASC = 'listings_count_asc',
  LISTINGS_COUNT_DESC = 'listings_count_desc'
}