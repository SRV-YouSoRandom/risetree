export interface Profile {
  id: string;
  wallet_address?: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  provider?: 'wallet' | 'google' | 'discord';
  provider_id?: string;
  links: Link[];
  nfts: NFT[];
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
}

export interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  token_id: string;
  contract_address: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
}