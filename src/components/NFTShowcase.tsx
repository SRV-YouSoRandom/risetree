import React from 'react';
import { Image, ExternalLink } from 'lucide-react';
import { NFT } from '@/types';

interface NFTShowcaseProps {
  nfts: NFT[];
  isOwner: boolean;
}

export const NFTShowcase: React.FC<NFTShowcaseProps> = ({ nfts, isOwner }) => {
  const handleNFTClick = (nft: NFT) => {
    // Open NFT on marketplace (example: OpenSea)
    const url = `https://opensea.io/assets/ethereum/${nft.contract_address}/${nft.token_id}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">NFT Collection</h2>
        {isOwner && (
          <button className="text-sm text-rise-600 hover:text-rise-700">
            Sync Collection
          </button>
        )}
      </div>

      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            {isOwner ? 'Connect your wallet to sync NFTs' : 'No NFTs to display'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <div
              key={`${nft.contract_address}-${nft.token_id}`}
              className="group cursor-pointer"
              onClick={() => handleNFTClick(nft)}
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {nft.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">{nft.collection}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};