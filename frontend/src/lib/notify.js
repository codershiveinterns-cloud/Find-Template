import { notification } from 'antd';

let notificationApi = null;

const baseOptions = {
  placement: 'topRight',
  duration: 3,
  className: 'app-notification',
};

export const setNotificationApi = (api) => {
  notificationApi = api;
};

const openNotification = (type, title, description = '') => {
  const api = notificationApi || notification;
  api[type]({
    ...baseOptions,
    title,
    description,
  });
};

export const notifySuccess = (title, description = '') => {
  openNotification('success', title, description);
};

export const notifyError = (title, description = '') => {
  openNotification('error', title, description);
};
