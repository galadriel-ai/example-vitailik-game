const SUI_ADDRESS_LENGTH: number = 32;

const isHex = (value: string): boolean => {
  return /^(0x|0X)?[a-fA-F0-9]+$/.test(value) && value.length % 2 === 0;
}

const getHexByteLength = (value: string): number => {
  return /^(0x|0X)/.test(value) ? (value.length - 2) / 2 : value.length / 2;
}

const isValidSuiAddress = (value: string): boolean => {
  return isHex(value) && getHexByteLength(value) === SUI_ADDRESS_LENGTH;
}

export default function Page({
  params,
}: {
  params: { address: string }
}) {
  return <p>Address: {params.address}</p>
}