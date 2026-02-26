'use client';

import { API_BASE_URL } from '@/utils/constants';
import { io } from 'socket.io-client';

const socket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });

export default socket;
