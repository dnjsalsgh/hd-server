import axios from 'axios';
import * as process from 'process';
import { PsApiResponse } from '../../simulator-result/dto/ps-output.dto';
import { HttpException } from '@nestjs/common';
import { userSelectOutput } from '../../simulator-result/dto/user-select-output';
import { awbInPalletRackResult } from '../../simulator-result/dto/get-Awb-in-palletPack.dto';
import { PsAllResponse } from '../../simulator-result/dto/ps-all-output.dto';
import { PrepareBreakDownAwbInputDto } from '../../awb/dto/prepare-break-down-awb-input.dto';
import { PrepareBreakDownAwbOutputDto } from '../../awb/dto/prepare-break-down-awb-output.dto';

export const checkPsServer = async (): Promise<PsApiResponse> => {
  try {
    const response = await axios.get(`${process.env.PS_SERVER}/`, {
      headers: {
        'Content-Type': 'application/json', // JSON 형식의 데이터 전송
      },
    });
    const data = response.data; // 응답 데이터 가져오기
    return data;
  } catch (error) {
    throw new HttpException(`ps 정보를 받아오지 못했습니다.${error}`, 404); // 에러 처리
  }
};

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

export const reboot = async (input: any): Promise<userSelectOutput> => {
  try {
    const response = await axios.post<userSelectOutput>(
      `${process.env.PS_SERVER}/reboot`,
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

export const getAWBinPalletRack = async (
  input: any,
): Promise<awbInPalletRackResult> => {
  try {
    const response = await axios.post<awbInPalletRackResult>(
      `${process.env.PS_SERVER}/get-awb-id-in-pallet-rack`,
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

export const packageSimulatorCallAll = async (
  input: any,
): Promise<PsAllResponse> => {
  try {
    const response = await axios.post<PsAllResponse>(
      `${process.env.PS_SERVER}/package-simulator-call-all`,
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

export const sendSlackMessage = async (input: any) => {
  try {
    const response = await axios.post<PsAllResponse>(
      `${process.env.SLACK_URL}`,
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
    // 에러가 나도 서버가 꺼지지 않게 처리
    // throw new HttpException(`slack 연동이 안되었습니다.${error}`, 404); // 에러 처리
  }
};

export const breakDownRequest = async (input: any) => {
  try {
    const response = await axios.post<PrepareBreakDownAwbOutputDto>(
      `${process.env.PS_SERVER}/break-down`,
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
    // throw new HttpException(`ps 정보를 받아오지 못했습니다.${error}`, 404); // 에러 처리
  }
};

export const uldDeployCheckerRequest = async (input: any) => {
  try {
    const response = await axios.post<PrepareBreakDownAwbInputDto[]>(
      `${process.env.PS_SERVER}/uld-deploy-checker`,
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
    // throw new HttpException(`ps 정보를 받아오지 못했습니다.${error}`, 404); // 에러 처리
  }
};
