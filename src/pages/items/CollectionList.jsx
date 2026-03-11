import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { COLLECTIONS } from '../../data/collectionsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function CollectionList() {
  const { collectionKey } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, ownedCollections, buyCollectionItem, sellCollectionItem } = useGame();
  const [tab, setTab] = useState('market');

  const collection = COLLECTIONS[collectionKey];
  if (!collection) return <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}><p className={t.text.secondary}>Not found</p></div>;

  const owned = (ownedCollections || {})[collectionKey] || [];
  const marketItems = collection.items.filter(item => !owned.includes(item.id));
  const myItems = collection.items.filter(item => owned.includes(item.id));

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/items')} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>{collection.name}</h1>
      </div>

      <div className="flex-shrink-0 px-3 py-2">
        <p className={`text-xs ${t.text.secondary} mb-2`}>Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span></p>
        <div className={`flex rounded-xl p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {['market', 'collection'].map(tb => (
            <button key={tb} onClick={() => setTab(tb)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all
                ${tab === tb ? 'bg-purple-500 text-white' : t.text.secondary}`}>
              {tb === 'market' ? 'Market' : 'My Collection'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-2">
        {tab === 'market' ? (
          marketItems.length === 0 ? (
            <p className={`text-center py-10 text-sm ${t.text.secondary}`}>All items purchased!</p>
          ) : (
            marketItems.map(item => (
              <button key={item.id} onClick={() => {
                if (balance >= item.price) { buyCollectionItem(collectionKey, item.id, item.price); }
              }}
                className={`w-full rounded-xl p-3 flex items-center gap-3 text-left transition-all active:scale-[0.98] ${t.bg.card} border ${t.border.default}`}>
                <span className="text-3xl">{item.image}</span>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${t.text.primary}`}>{item.name}</p>
                  <p className={`text-sm font-bold ${t.text.brand}`}>{formatCurrency(item.price)}</p>
                </div>
              </button>
            ))
          )
        ) : (
          myItems.length === 0 ? (
            <p className={`text-center py-10 text-sm ${t.text.secondary}`}>There are no items in your collection</p>
          ) : (
            myItems.map(item => (
              <div key={item.id} className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.image}</span>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${t.text.primary}`}>{item.name}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>Sale Price: {formatCurrency(item.sellPrice)}</p>
                  </div>
                </div>
                <button onClick={() => sellCollectionItem(collectionKey, item.id)}
                  className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white active:scale-95">
                  Sell — {formatCurrency(item.sellPrice)}
                </button>
              </div>
            ))
          )
        )}
      </div>
      <AdSpace />
    </div>
  );
}

export default CollectionList;