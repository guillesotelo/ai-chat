import axios from 'axios';
import { dataObj } from '../types';

const API_URL = ''

const getHeaders = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { authorization: `Bearer ${token}` }
}
const getConfig = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { headers: { authorization: `Bearer ${token}` } }
}
const updateMessageSession = async (data: dataObj) => {
    try {
        const updated = await axios.post(`${API_URL}/api/app/updateMessageSession`, data, getConfig())
        return updated.data
    } catch (err) { console.log(err) }
}

const getMessageSession = async () => {
    try {
        const sessions = await axios.get(`${API_URL}/api/app/getSessionMessages`, getConfig())
        return sessions.data
    } catch (err) { console.log(err) }
}

const sendNewMessage = async (data: dataObj) => {
    try {
        const response = await axios.post(`${API_URL}/api/chat/newMessage`, data, getConfig())
        return response.data
    } catch (err) { console.log(err) }
}

export {
    updateMessageSession,
    getMessageSession,
    sendNewMessage
}