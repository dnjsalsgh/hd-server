// 폴더와 db와 차이가 나는 파일이름 찾기
export function findDuplicates(array1: string[], awbName: string) {
  return array1.filter((item) => item === awbName);
}
