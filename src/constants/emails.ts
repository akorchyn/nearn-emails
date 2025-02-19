import { PROJECT_NAME } from './project';

export const ceoName = 'Ori';
export const ceoEmail = `${ceoName} from ${PROJECT_NAME} <${process.env.CEO_EMAIL}>`;
export const listingsEmail = `${PROJECT_NAME} <${process.env.LISTINGS_EMAIL}>`;
export const alertsEmail = `${PROJECT_NAME} <${process.env.ALERTS_EMAIL}>`;
