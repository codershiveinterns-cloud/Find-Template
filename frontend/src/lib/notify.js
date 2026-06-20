import { notification } from 'antd';

const baseOptions = {
  placement: 'topRight',
  duration: 3,
  className: 'app-notification',
};

export const notifySuccess = (title, description = '') => {
  notification.success({
    ...baseOptions,
    title,
    description,
  });
};

export const notifyError = (title, description = '') => {
  notification.error({
    ...baseOptions,
    title,
    description,
  });
};
