// src/context/actions/investingActions.js

import { calcTotalIncome } from '../helpers/incomeCalculator';
import { PROPERTIES, getPropertyMarketValue } from '../../data/realEstate';
import { PROPERTY_SELL_TAX } from '../../config/constants';

export const createInvestingActions = (setState) => {

  // ═══ BUY STOCK ═══
  const buyStock = (stockId, quantity, pricePerShare) => {
    setState(p => {
      const totalCost = quantity * pricePerShare;
      if (p.balance < totalCost) return p;
      const existing = p.ownedStocks.find(s => s.stockId === stockId);
      let newOwned;
      if (existing) {
        const totalShares = existing.quantity + quantity;
        const totalValue = (existing.avgBuyPrice * existing.quantity) + totalCost;
        const newAvgPrice = Math.floor(totalValue / totalShares);
        newOwned = p.ownedStocks.map(s =>
          s.stockId === stockId
            ? { ...s, quantity: totalShares, avgBuyPrice: newAvgPrice }
            : s
        );
      } else {
        newOwned = [...p.ownedStocks, {
          stockId, quantity, avgBuyPrice: pricePerShare, purchasedAt: Date.now()
        }];
      }
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedStocks: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, p.ownedProperties, newOwned),
      };
    });
  };

  // ═══ SELL STOCK ═══
  const sellStock = (stockId, quantity, pricePerShare) => {
    setState(p => {
      const existing = p.ownedStocks.find(s => s.stockId === stockId);
      if (!existing || existing.quantity < quantity) return p;
      const proceeds = quantity * pricePerShare;
      const remaining = existing.quantity - quantity;
      let newOwned;
      if (remaining <= 0) {
        newOwned = p.ownedStocks.filter(s => s.stockId !== stockId);
      } else {
        newOwned = p.ownedStocks.map(s =>
          s.stockId === stockId ? { ...s, quantity: remaining } : s
        );
      }
      return {
        ...p,
        balance: p.balance + proceeds,
        ownedStocks: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, p.ownedProperties, newOwned),
      };
    });
  };

  // ═══ BUY CRYPTO ═══
  const buyCrypto = (cryptoId, quantity, pricePerCoin) => {
    setState(p => {
      const totalCost = Math.floor(quantity * pricePerCoin);
      if (p.balance < totalCost) return p;
      const existing = p.ownedCrypto.find(c => c.cryptoId === cryptoId);
      let newOwned;
      if (existing) {
        const totalCoins = parseFloat((existing.quantity + quantity).toFixed(8));
        const totalValue = (existing.avgBuyPrice * existing.quantity) + totalCost;
        const newAvgPrice = Math.floor(totalValue / totalCoins);
        newOwned = p.ownedCrypto.map(c =>
          c.cryptoId === cryptoId
            ? { ...c, quantity: totalCoins, avgBuyPrice: newAvgPrice }
            : c
        );
      } else {
        newOwned = [...p.ownedCrypto, {
          cryptoId, quantity: parseFloat(quantity.toFixed(8)),
          avgBuyPrice: pricePerCoin, purchasedAt: Date.now()
        }];
      }
      return { ...p, balance: p.balance - totalCost, ownedCrypto: newOwned };
    });
  };

  // ═══ SELL CRYPTO ═══
  const sellCrypto = (cryptoId, quantity, pricePerCoin) => {
    setState(p => {
      const existing = p.ownedCrypto.find(c => c.cryptoId === cryptoId);
      if (!existing || existing.quantity + 0.00000001 < quantity) return p;
      const proceeds = Math.floor(quantity * pricePerCoin);
      const remaining = parseFloat((existing.quantity - quantity).toFixed(8));
      let newOwned;
      if (remaining <= 0.00000001) {
        newOwned = p.ownedCrypto.filter(c => c.cryptoId !== cryptoId);
      } else {
        newOwned = p.ownedCrypto.map(c =>
          c.cryptoId === cryptoId ? { ...c, quantity: remaining } : c
        );
      }
      return { ...p, balance: p.balance + proceeds, ownedCrypto: newOwned };
    });
  };

  // ═══ BUY PROPERTY ═══
  const buyProperty = (propertyId) => {
    setState(p => {
      const prop = PROPERTIES.find(pr => pr.id === propertyId);
      if (!prop || p.balance < prop.price) return p;
      if (p.ownedProperties.some(op => op.propertyId === propertyId)) return p;
      const newOwned = [...p.ownedProperties, {
        propertyId, purchasedAt: Date.now(), purchasePrice: prop.price, improvements: []
      }];
      return {
        ...p,
        balance: p.balance - prop.price,
        ownedProperties: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, newOwned, p.ownedStocks),
      };
    });
  };

  // ═══ SELL PROPERTY ═══
  const sellProperty = (propertyId) => {
    setState(p => {
      const owned = p.ownedProperties.find(op => op.propertyId === propertyId);
      if (!owned) return p;
      const marketValue = getPropertyMarketValue(propertyId, owned.improvements || []);
      const afterTax = Math.floor(marketValue * (1 - PROPERTY_SELL_TAX));
      const newOwned = p.ownedProperties.filter(op => op.propertyId !== propertyId);
      return {
        ...p,
        balance: p.balance + afterTax,
        ownedProperties: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, newOwned, p.ownedStocks),
      };
    });
  };

  // ═══ BUY IMPROVEMENT ═══
  const buyImprovement = (propertyId, improvementId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const newOwned = p.ownedProperties.map(op => {
        if (op.propertyId !== propertyId) return op;
        if ((op.improvements || []).includes(improvementId)) return op;
        return { ...op, improvements: [...(op.improvements || []), improvementId] };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedProperties: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, newOwned, p.ownedStocks),
      };
    });
  };

  return {
    buyStock, sellStock,
    buyCrypto, sellCrypto,
    buyProperty, sellProperty, buyImprovement,
  };
};