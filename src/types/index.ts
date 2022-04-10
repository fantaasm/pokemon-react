export interface PokemonBasic {
  id: number;
  name: string;
  url: string;
}

export type PokemonDetails = {
  height: number;
  weight: number;
  types: Type[];
  stats: any;
  species: {
    url: string;
  };
  evolvesFrom?: string;
  flavorText: string;
  generation: string;
  color: string;
  genus: string;
};

export interface Species {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: Species;
}
