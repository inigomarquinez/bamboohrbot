import moment from 'moment';
import sdk from '@api/bamboohr'; // @bamboohr/v1#43haj4kl796vw3d

import { TBambooHRWhosOut, TWhosOut } from '..';
import { BAMBOOHR_TIME_WHOS_OUT_TYPE, YEAR_MONTH_DATE_FORMAT } from '../common';
import commonMetadata from './commonMetadata';
import { nextWorkingDay } from '../utils/nextWorkingDay';

export default async function fetchBankHolidays(
  today: moment.Moment
): Promise<TWhosOut> {
  const { data: whosOutData } = await sdk.getAListOfWhoSOut({
    ...commonMetadata,
    start: nextWorkingDay(today).format(YEAR_MONTH_DATE_FORMAT),
    end: nextWorkingDay(today).format(YEAR_MONTH_DATE_FORMAT),
  });

  const { data: whosOutThisMonthData } = await sdk.getAListOfWhoSOut({
    ...commonMetadata,
    start: moment(today).startOf('month').format(YEAR_MONTH_DATE_FORMAT),
    end: moment(today).endOf('month').format(YEAR_MONTH_DATE_FORMAT),
  });

  return {
    next: (whosOutData as TBambooHRWhosOut[]).filter(
      e => e.type === BAMBOOHR_TIME_WHOS_OUT_TYPE
    ),
    month: (whosOutThisMonthData as TBambooHRWhosOut[]).filter(
      e => e.type === BAMBOOHR_TIME_WHOS_OUT_TYPE
    ),
  };
}