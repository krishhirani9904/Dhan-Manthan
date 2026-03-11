export const FORBES_NPCS = [
  { id: 'npc_1', name: 'Mukesh Dhirubhai', avatar: '👨‍💼', baseWealth: 500000000000 },
  { id: 'npc_2', name: 'Gautam Shantilal', avatar: '🧔', baseWealth: 400000000000 },
  { id: 'npc_3', name: 'Shiv Ratan', avatar: '👴', baseWealth: 350000000000 },
  { id: 'npc_4', name: 'Lakshmi Narayan', avatar: '👨‍🦳', baseWealth: 300000000000 },
  { id: 'npc_5', name: 'Radha Kishan', avatar: '🧑‍💼', baseWealth: 250000000000 },
  { id: 'npc_6', name: 'Kumar Birla', avatar: '👨‍💼', baseWealth: 200000000000 },
  { id: 'npc_7', name: 'Dilip Shanghvi', avatar: '🧔', baseWealth: 180000000000 },
  { id: 'npc_8', name: 'Cyrus Pallonji', avatar: '👨‍🦰', baseWealth: 160000000000 },
  { id: 'npc_9', name: 'Uday Kotak', avatar: '👨', baseWealth: 140000000000 },
  { id: 'npc_10', name: 'Sunil Mittal', avatar: '🧑', baseWealth: 120000000000 },
  { id: 'npc_11', name: 'Anand Mahindra', avatar: '👨‍💼', baseWealth: 100000000000 },
  { id: 'npc_12', name: 'Ratan Naval', avatar: '👴', baseWealth: 80000000000 },
  { id: 'npc_13', name: 'Adar Poonawalla', avatar: '🧔', baseWealth: 60000000000 },
  { id: 'npc_14', name: 'Harsh Goenka', avatar: '🧑‍💼', baseWealth: 40000000000 },
  { id: 'npc_15', name: 'Rahul Bajaj Jr.', avatar: '👨', baseWealth: 20000000000 },
  { id: 'npc_16', name: 'Vijay Shekhar', avatar: '🧑', baseWealth: 10000000000 },
  { id: 'npc_17', name: 'Nikhil Kamath', avatar: '👨‍🦱', baseWealth: 5000000000 },
  { id: 'npc_18', name: 'Deepinder Goyal', avatar: '🧔', baseWealth: 2000000000 },
  { id: 'npc_19', name: 'Bhavish Agarwal', avatar: '👨', baseWealth: 1000000000 },
  { id: 'npc_20', name: 'Kunal Shah', avatar: '🧑', baseWealth: 500000000 },
];

export const getForbesRanking = (playerWealth) => {
  const all = [
    ...FORBES_NPCS.map(npc => ({ ...npc, isPlayer: false })),
    { id: 'player', name: 'You', avatar: '🎮', baseWealth: playerWealth, isPlayer: true },
  ];
  all.sort((a, b) => b.baseWealth - a.baseWealth);
  return all.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
};