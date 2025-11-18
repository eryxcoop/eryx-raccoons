import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  secretKey(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  buyTicket(context: __compactRuntime.CircuitContext<T>,
            merkleRoot_0: { field: bigint }): __compactRuntime.CircuitResults<T, bigint>;
  checkTicket(context: __compactRuntime.CircuitContext<T>,
              ticket_0: { field: bigint }): __compactRuntime.CircuitResults<T, boolean>;
}

export type PureCircuits = {
  publicKey(secret_key_0: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  buyTicket(context: __compactRuntime.CircuitContext<T>,
            merkleRoot_0: { field: bigint }): __compactRuntime.CircuitResults<T, bigint>;
  checkTicket(context: __compactRuntime.CircuitContext<T>,
              ticket_0: { field: bigint }): __compactRuntime.CircuitResults<T, boolean>;
  publicKey(context: __compactRuntime.CircuitContext<T>,
            secret_key_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type Ledger = {
  readonly eventName: string;
  readonly eventDescription: string;
  readonly eventCapacity: bigint;
  readonly eventOwner: Uint8Array;
  readonly ticketPrice: bigint;
  userData: {
    isEmpty(): boolean;
    length(): bigint;
    head(): { is_some: boolean, value: string };
    [Symbol.iterator](): Iterator<string>
  };
  usedTickets: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: { field: bigint }): boolean;
    lookup(key_0: { field: bigint }): boolean;
    [Symbol.iterator](): Iterator<[{ field: bigint }, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>,
               eventName__0: string,
               eventDescription__0: string,
               eventCapacity__0: bigint,
               ticketPrice__0: bigint): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
