// src/context/actions/itemActions.js

import { generateId } from '../../utils/helpers';
import { CAR_SELL_PERCENT, AIRCRAFT_SELL_PERCENT } from '../../config/constants';
import { COLLECTIONS } from '../../data/collectionsData';
import { ISLAND_SELL_LOSS_PERCENT } from '../../data/islandsData';

export const createItemActions = (setState) => {

  // ═══ CAR ═══
  const buyCar = (info) => {
    setState(p => {
      if (p.balance < info.totalPrice) return p;
      const car = {
        id: generateId('car'), carDefId: info.carDefId, name: info.name,
        image: info.image, basePrice: info.basePrice, engineType: info.engineType,
        equipmentType: info.equipmentType, totalPrice: info.totalPrice,
        purchasedAt: Date.now(),
      };
      return {
        ...p,
        balance: p.balance - info.totalPrice,
        ownedCars: [...(p.ownedCars || []), car],
      };
    });
  };

  const sellCar = (carId) => {
    setState(p => {
      const car = (p.ownedCars || []).find(c => c.id === carId);
      if (!car) return p;
      const salePrice = Math.floor(car.totalPrice * CAR_SELL_PERCENT);
      return {
        ...p,
        balance: p.balance + salePrice,
        ownedCars: (p.ownedCars || []).filter(c => c.id !== carId),
      };
    });
  };

  // ═══ AIRCRAFT ═══
  const buyAircraft = (info) => {
    setState(p => {
      if (p.balance < info.totalPrice) return p;
      const ac = {
        id: generateId('air'), acDefId: info.acDefId, name: info.name,
        image: info.image, basePrice: info.basePrice, teamHired: info.teamHired,
        designType: info.designType, totalPrice: info.totalPrice,
        purchasedAt: Date.now(),
      };
      return {
        ...p,
        balance: p.balance - info.totalPrice,
        ownedAircraft: [...(p.ownedAircraft || []), ac],
      };
    });
  };

  const sellAircraft = (acId) => {
    setState(p => {
      const ac = (p.ownedAircraft || []).find(a => a.id === acId);
      if (!ac) return p;
      const salePrice = Math.floor(ac.totalPrice * AIRCRAFT_SELL_PERCENT);
      return {
        ...p,
        balance: p.balance + salePrice,
        ownedAircraft: (p.ownedAircraft || []).filter(a => a.id !== acId),
      };
    });
  };

  // ═══ YACHT ═══
  const buyYacht = (info) => {
    setState(p => {
      if (p.balance < info.totalPrice) return p;
      const yacht = {
        id: generateId('yacht'), yachtDefId: info.yachtDefId, name: info.name,
        image: info.image, basePrice: info.basePrice, teamHired: info.teamHired,
        designType: info.designType, locationId: info.locationId || 'public_harbor',
        totalPrice: info.totalPrice, purchasedAt: Date.now(),
      };
      return {
        ...p,
        balance: p.balance - info.totalPrice,
        ownedYachts: [...(p.ownedYachts || []), yacht],
      };
    });
  };

  const sellYacht = (yachtId) => {
    setState(p => {
      const yacht = (p.ownedYachts || []).find(y => y.id === yachtId);
      if (!yacht) return p;
      const salePrice = Math.floor(yacht.totalPrice * 0.70);
      return {
        ...p,
        balance: p.balance + salePrice,
        ownedYachts: (p.ownedYachts || []).filter(y => y.id !== yachtId),
      };
    });
  };

  const updateYachtLocation = (yachtId, locationId) => {
    setState(p => ({
      ...p,
      ownedYachts: (p.ownedYachts || []).map(y =>
        y.id === yachtId ? { ...y, locationId } : y
      ),
    }));
  };

  // ═══ COLLECTIONS ═══
  const buyCollectionItem = (collectionKey, itemId, price) => {
    setState(p => {
      if (p.balance < price) return p;
      const current = (p.ownedCollections || {})[collectionKey] || [];
      if (current.includes(itemId)) return p;
      return {
        ...p,
        balance: p.balance - price,
        ownedCollections: {
          ...(p.ownedCollections || {}),
          [collectionKey]: [...current, itemId],
        },
      };
    });
  };

  const sellCollectionItem = (collectionKey, itemId) => {
    setState(p => {
      const current = (p.ownedCollections || {})[collectionKey] || [];
      if (!current.includes(itemId)) return p;
      const col = COLLECTIONS[collectionKey];
      const item = col?.items.find(i => i.id === itemId);
      if (!item) return p;
      return {
        ...p,
        balance: p.balance + item.sellPrice,
        ownedCollections: {
          ...(p.ownedCollections || {}),
          [collectionKey]: current.filter(id => id !== itemId),
        },
      };
    });
  };

  // ═══ NFT ═══
  const buyNFT = (nftId, cryptoId, cryptoAmount) => {
    setState(p => {
      if ((p.ownedNFTs || []).includes(nftId)) return p;
      const crypto = (p.ownedCrypto || []).find(c => c.cryptoId === cryptoId);
      if (!crypto || crypto.quantity < cryptoAmount) return p;
      const remaining = parseFloat((crypto.quantity - cryptoAmount).toFixed(8));
      let newCrypto;
      if (remaining <= 0.00000001) {
        newCrypto = (p.ownedCrypto || []).filter(c => c.cryptoId !== cryptoId);
      } else {
        newCrypto = (p.ownedCrypto || []).map(c =>
          c.cryptoId === cryptoId ? { ...c, quantity: remaining } : c
        );
      }
      return {
        ...p,
        ownedCrypto: newCrypto,
        ownedNFTs: [...(p.ownedNFTs || []), nftId],
      };
    });
  };

  // ═══ ISLANDS ═══
  const buyIsland = (islandId, price) => {
    setState(p => {
      if (p.balance < price) return p;
      if ((p.ownedIslands || []).some(i => i.islandId === islandId)) return p;
      return {
        ...p,
        balance: p.balance - price,
        ownedIslands: [...(p.ownedIslands || []), {
          islandId, purchasePrice: price, purchasedAt: Date.now(),
        }],
      };
    });
  };

  const sellIsland = (islandId) => {
    setState(p => {
      const island = (p.ownedIslands || []).find(i => i.islandId === islandId);
      if (!island) return p;
      const salePrice = Math.floor(island.purchasePrice * (1 - ISLAND_SELL_LOSS_PERCENT));
      return {
        ...p,
        balance: p.balance + salePrice,
        ownedIslands: (p.ownedIslands || []).filter(i => i.islandId !== islandId),
      };
    });
  };

  return {
    buyCar, sellCar,
    buyAircraft, sellAircraft,
    buyYacht, sellYacht, updateYachtLocation,
    buyCollectionItem, sellCollectionItem,
    buyNFT,
    buyIsland, sellIsland,
  };
};