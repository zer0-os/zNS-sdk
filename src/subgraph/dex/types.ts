export interface TokenDto {
  id: string,
  name: string;
  symbol: string;
  decimals: string;
  derivedETH: string;
}

export interface TokenInfoDto {
  tokens: TokenDto[]
}
