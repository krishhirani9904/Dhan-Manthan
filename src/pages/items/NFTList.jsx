import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { NFTS } from '../../data/nftsData';
import { CRYPTOCURRENCIES } from '../../data/cryptoData';
import AdSpace from '../../components/common/AdSpace';

function NFTList() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedNFTs, ownedCrypto, buyNFT } = useGame();
  const owned = ownedNFTs || [];

  const handleBuy = (nft) => {
    const crypto = (ownedCrypto || []).find(c => c.cryptoId === nft.cryptoId);
    if (!crypto || crypto.quantity < nft.cryptoAmount) return;
    buyNFT(nft.id, nft.cryptoId, nft.cryptoAmount);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/items')} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>NFT Marketplace</h1>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {NFTS.map(nft => {
          const isOwned = owned.includes(nft.id);
          const cryptoDef = CRYPTOCURRENCIES.find(c => c.id === nft.cryptoId);
          const userCrypto = (ownedCrypto || []).find(c => c.cryptoId === nft.cryptoId);
          const canBuy = !isOwned && userCrypto && userCrypto.quantity >= nft.cryptoAmount;

          return (
            <div key={nft.id} className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default} ${isOwned ? (isDark ? 'border-green-500/30' : 'border-green-200') : ''}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{nft.image}</span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${t.text.primary}`}>{nft.name}</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>{nft.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-bold ${t.text.brand}`}>{nft.cryptoAmount} {cryptoDef?.ticker || '???'}</p>
                {isOwned ? (
                  <span className="text-[10px] font-bold text-green-500 px-2 py-1 rounded-full bg-green-500/10">Owned</span>
                ) : (
                  <button onClick={() => handleBuy(nft)} disabled={!canBuy}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95
                      ${canBuy ? 'bg-purple-500 text-white' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                    {canBuy ? 'Buy' : 'Not enough crypto'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <AdSpace />
    </div>
  );
}

export default NFTList;