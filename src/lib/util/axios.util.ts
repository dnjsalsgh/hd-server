import axios from 'axios';
import * as process from 'process';
import { PsApiResponse } from '../../simulator-result/dto/ps-output.dto';
import { HttpException } from '@nestjs/common';
import { userSelectOutput } from '../../simulator-result/dto/user-select-output';

export const getOrderDischarge = async (input: any): Promise<PsApiResponse> => {
  try {
    const response = await axios.post<PsApiResponse>(
      `${process.env.PS_SERVER}/package-simulator-call`,
      input,
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식의 데이터 전송
        },
      },
    );
    const data = response.data; // 응답 데이터 가져오기
    return data;
  } catch (error) {
    throw new HttpException(`ps 정보를 받아오지 못했습니다.${error}`, 404); // 에러 처리
  }
};

export const getUserSelect = async (input: any): Promise<userSelectOutput> => {
  try {
    const response = await axios.post<userSelectOutput>(
      `${process.env.PS_SERVER}/user-select`,
      input,
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식의 데이터 전송
        },
      },
    );
    const data = response.data; // 응답 데이터 가져오기
    return data;
  } catch (error) {
    throw new HttpException(`ps 정보를 받아오지 못했습니다.${error}`, 404); // 에러 처리
  }
};
