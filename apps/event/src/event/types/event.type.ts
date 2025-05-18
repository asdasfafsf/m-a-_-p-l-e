import { EVENT_TYPE_MAP } from '../constants/event.constant';

export type EventType = (typeof EVENT_TYPE_MAP)[keyof typeof EVENT_TYPE_MAP];
