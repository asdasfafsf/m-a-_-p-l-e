import { EVENT_STATE_MAP } from '../constants/event-state.constant';

export type EventState = (typeof EVENT_STATE_MAP)[keyof typeof EVENT_STATE_MAP];
