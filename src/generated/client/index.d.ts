
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>
/**
 * Model payment_methods
 * 
 */
export type payment_methods = $Result.DefaultSelection<Prisma.$payment_methodsPayload>
/**
 * Model user_sessions
 * 
 */
export type user_sessions = $Result.DefaultSelection<Prisma.$user_sessionsPayload>
/**
 * Model user_settings
 * 
 */
export type user_settings = $Result.DefaultSelection<Prisma.$user_settingsPayload>
/**
 * Model payment_transactions
 * 
 */
export type payment_transactions = $Result.DefaultSelection<Prisma.$payment_transactionsPayload>
/**
 * Model identity_verifications
 * 
 */
export type identity_verifications = $Result.DefaultSelection<Prisma.$identity_verificationsPayload>
/**
 * Model benefit_offers
 * 
 */
export type benefit_offers = $Result.DefaultSelection<Prisma.$benefit_offersPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PaymentType: {
  CARD: 'CARD',
  PAYPAL: 'PAYPAL',
  APPLEPAY: 'APPLEPAY',
  KAKAOPAY: 'KAKAOPAY',
  NAVERPAY: 'NAVERPAY',
  ETC: 'ETC'
};

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType]


export const DiscountType: {
  PERCENT: 'PERCENT',
  FLAT: 'FLAT'
};

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType]

}

export type PaymentType = $Enums.PaymentType

export const PaymentType: typeof $Enums.PaymentType

export type DiscountType = $Enums.DiscountType

export const DiscountType: typeof $Enums.DiscountType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.users.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.users.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment_methods`: Exposes CRUD operations for the **payment_methods** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payment_methods
    * const payment_methods = await prisma.payment_methods.findMany()
    * ```
    */
  get payment_methods(): Prisma.payment_methodsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_sessions`: Exposes CRUD operations for the **user_sessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_sessions
    * const user_sessions = await prisma.user_sessions.findMany()
    * ```
    */
  get user_sessions(): Prisma.user_sessionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_settings`: Exposes CRUD operations for the **user_settings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_settings
    * const user_settings = await prisma.user_settings.findMany()
    * ```
    */
  get user_settings(): Prisma.user_settingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment_transactions`: Exposes CRUD operations for the **payment_transactions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payment_transactions
    * const payment_transactions = await prisma.payment_transactions.findMany()
    * ```
    */
  get payment_transactions(): Prisma.payment_transactionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.identity_verifications`: Exposes CRUD operations for the **identity_verifications** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Identity_verifications
    * const identity_verifications = await prisma.identity_verifications.findMany()
    * ```
    */
  get identity_verifications(): Prisma.identity_verificationsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.benefit_offers`: Exposes CRUD operations for the **benefit_offers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Benefit_offers
    * const benefit_offers = await prisma.benefit_offers.findMany()
    * ```
    */
  get benefit_offers(): Prisma.benefit_offersDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.0.1
   * Query Engine version: f09f2815f091dbba658cdcd2264306d88bb5bda6
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    users: 'users',
    payment_methods: 'payment_methods',
    user_sessions: 'user_sessions',
    user_settings: 'user_settings',
    payment_transactions: 'payment_transactions',
    identity_verifications: 'identity_verifications',
    benefit_offers: 'benefit_offers'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "users" | "payment_methods" | "user_sessions" | "user_settings" | "payment_transactions" | "identity_verifications" | "benefit_offers"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      payment_methods: {
        payload: Prisma.$payment_methodsPayload<ExtArgs>
        fields: Prisma.payment_methodsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.payment_methodsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.payment_methodsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>
          }
          findFirst: {
            args: Prisma.payment_methodsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.payment_methodsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>
          }
          findMany: {
            args: Prisma.payment_methodsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>[]
          }
          create: {
            args: Prisma.payment_methodsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>
          }
          createMany: {
            args: Prisma.payment_methodsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.payment_methodsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>[]
          }
          delete: {
            args: Prisma.payment_methodsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>
          }
          update: {
            args: Prisma.payment_methodsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>
          }
          deleteMany: {
            args: Prisma.payment_methodsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.payment_methodsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.payment_methodsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>[]
          }
          upsert: {
            args: Prisma.payment_methodsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_methodsPayload>
          }
          aggregate: {
            args: Prisma.Payment_methodsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment_methods>
          }
          groupBy: {
            args: Prisma.payment_methodsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Payment_methodsGroupByOutputType>[]
          }
          count: {
            args: Prisma.payment_methodsCountArgs<ExtArgs>
            result: $Utils.Optional<Payment_methodsCountAggregateOutputType> | number
          }
        }
      }
      user_sessions: {
        payload: Prisma.$user_sessionsPayload<ExtArgs>
        fields: Prisma.user_sessionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_sessionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_sessionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>
          }
          findFirst: {
            args: Prisma.user_sessionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_sessionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>
          }
          findMany: {
            args: Prisma.user_sessionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>[]
          }
          create: {
            args: Prisma.user_sessionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>
          }
          createMany: {
            args: Prisma.user_sessionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_sessionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>[]
          }
          delete: {
            args: Prisma.user_sessionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>
          }
          update: {
            args: Prisma.user_sessionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>
          }
          deleteMany: {
            args: Prisma.user_sessionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_sessionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.user_sessionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>[]
          }
          upsert: {
            args: Prisma.user_sessionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionsPayload>
          }
          aggregate: {
            args: Prisma.User_sessionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_sessions>
          }
          groupBy: {
            args: Prisma.user_sessionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_sessionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_sessionsCountArgs<ExtArgs>
            result: $Utils.Optional<User_sessionsCountAggregateOutputType> | number
          }
        }
      }
      user_settings: {
        payload: Prisma.$user_settingsPayload<ExtArgs>
        fields: Prisma.user_settingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_settingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_settingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>
          }
          findFirst: {
            args: Prisma.user_settingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_settingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>
          }
          findMany: {
            args: Prisma.user_settingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>[]
          }
          create: {
            args: Prisma.user_settingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>
          }
          createMany: {
            args: Prisma.user_settingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_settingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>[]
          }
          delete: {
            args: Prisma.user_settingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>
          }
          update: {
            args: Prisma.user_settingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>
          }
          deleteMany: {
            args: Prisma.user_settingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_settingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.user_settingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>[]
          }
          upsert: {
            args: Prisma.user_settingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_settingsPayload>
          }
          aggregate: {
            args: Prisma.User_settingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_settings>
          }
          groupBy: {
            args: Prisma.user_settingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_settingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_settingsCountArgs<ExtArgs>
            result: $Utils.Optional<User_settingsCountAggregateOutputType> | number
          }
        }
      }
      payment_transactions: {
        payload: Prisma.$payment_transactionsPayload<ExtArgs>
        fields: Prisma.payment_transactionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.payment_transactionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.payment_transactionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>
          }
          findFirst: {
            args: Prisma.payment_transactionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.payment_transactionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>
          }
          findMany: {
            args: Prisma.payment_transactionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>[]
          }
          create: {
            args: Prisma.payment_transactionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>
          }
          createMany: {
            args: Prisma.payment_transactionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.payment_transactionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>[]
          }
          delete: {
            args: Prisma.payment_transactionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>
          }
          update: {
            args: Prisma.payment_transactionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>
          }
          deleteMany: {
            args: Prisma.payment_transactionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.payment_transactionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.payment_transactionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>[]
          }
          upsert: {
            args: Prisma.payment_transactionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$payment_transactionsPayload>
          }
          aggregate: {
            args: Prisma.Payment_transactionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment_transactions>
          }
          groupBy: {
            args: Prisma.payment_transactionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Payment_transactionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.payment_transactionsCountArgs<ExtArgs>
            result: $Utils.Optional<Payment_transactionsCountAggregateOutputType> | number
          }
        }
      }
      identity_verifications: {
        payload: Prisma.$identity_verificationsPayload<ExtArgs>
        fields: Prisma.identity_verificationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.identity_verificationsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.identity_verificationsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>
          }
          findFirst: {
            args: Prisma.identity_verificationsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.identity_verificationsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>
          }
          findMany: {
            args: Prisma.identity_verificationsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>[]
          }
          create: {
            args: Prisma.identity_verificationsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>
          }
          createMany: {
            args: Prisma.identity_verificationsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.identity_verificationsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>[]
          }
          delete: {
            args: Prisma.identity_verificationsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>
          }
          update: {
            args: Prisma.identity_verificationsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>
          }
          deleteMany: {
            args: Prisma.identity_verificationsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.identity_verificationsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.identity_verificationsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>[]
          }
          upsert: {
            args: Prisma.identity_verificationsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$identity_verificationsPayload>
          }
          aggregate: {
            args: Prisma.Identity_verificationsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdentity_verifications>
          }
          groupBy: {
            args: Prisma.identity_verificationsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Identity_verificationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.identity_verificationsCountArgs<ExtArgs>
            result: $Utils.Optional<Identity_verificationsCountAggregateOutputType> | number
          }
        }
      }
      benefit_offers: {
        payload: Prisma.$benefit_offersPayload<ExtArgs>
        fields: Prisma.benefit_offersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.benefit_offersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.benefit_offersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>
          }
          findFirst: {
            args: Prisma.benefit_offersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.benefit_offersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>
          }
          findMany: {
            args: Prisma.benefit_offersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>[]
          }
          create: {
            args: Prisma.benefit_offersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>
          }
          createMany: {
            args: Prisma.benefit_offersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.benefit_offersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>[]
          }
          delete: {
            args: Prisma.benefit_offersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>
          }
          update: {
            args: Prisma.benefit_offersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>
          }
          deleteMany: {
            args: Prisma.benefit_offersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.benefit_offersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.benefit_offersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>[]
          }
          upsert: {
            args: Prisma.benefit_offersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$benefit_offersPayload>
          }
          aggregate: {
            args: Prisma.Benefit_offersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBenefit_offers>
          }
          groupBy: {
            args: Prisma.benefit_offersGroupByArgs<ExtArgs>
            result: $Utils.Optional<Benefit_offersGroupByOutputType>[]
          }
          count: {
            args: Prisma.benefit_offersCountArgs<ExtArgs>
            result: $Utils.Optional<Benefit_offersCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    users?: usersOmit
    payment_methods?: payment_methodsOmit
    user_sessions?: user_sessionsOmit
    user_settings?: user_settingsOmit
    payment_transactions?: payment_transactionsOmit
    identity_verifications?: identity_verificationsOmit
    benefit_offers?: benefit_offersOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    payment_methods: number
    user_sessions: number
    payment_transactions: number
    identity_verifications: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payment_methods?: boolean | UsersCountOutputTypeCountPayment_methodsArgs
    user_sessions?: boolean | UsersCountOutputTypeCountUser_sessionsArgs
    payment_transactions?: boolean | UsersCountOutputTypeCountPayment_transactionsArgs
    identity_verifications?: boolean | UsersCountOutputTypeCountIdentity_verificationsArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountPayment_methodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: payment_methodsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountUser_sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_sessionsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountPayment_transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: payment_transactionsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountIdentity_verificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: identity_verificationsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    seq: number | null
    preferred_payment_seq: number | null
  }

  export type UsersSumAggregateOutputType = {
    seq: bigint | null
    preferred_payment_seq: bigint | null
  }

  export type UsersMinAggregateOutputType = {
    seq: bigint | null
    uuid: string | null
    email: string | null
    password_hash: string | null
    social_provider: string | null
    social_id: string | null
    name: string | null
    preferred_payment_seq: bigint | null
    is_verified: boolean | null
    verified_at: Date | null
    ci: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    seq: bigint | null
    uuid: string | null
    email: string | null
    password_hash: string | null
    social_provider: string | null
    social_id: string | null
    name: string | null
    preferred_payment_seq: bigint | null
    is_verified: boolean | null
    verified_at: Date | null
    ci: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    seq: number
    uuid: number
    email: number
    password_hash: number
    social_provider: number
    social_id: number
    name: number
    preferred_payment_seq: number
    is_verified: number
    verified_at: number
    ci: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    seq?: true
    preferred_payment_seq?: true
  }

  export type UsersSumAggregateInputType = {
    seq?: true
    preferred_payment_seq?: true
  }

  export type UsersMinAggregateInputType = {
    seq?: true
    uuid?: true
    email?: true
    password_hash?: true
    social_provider?: true
    social_id?: true
    name?: true
    preferred_payment_seq?: true
    is_verified?: true
    verified_at?: true
    ci?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersMaxAggregateInputType = {
    seq?: true
    uuid?: true
    email?: true
    password_hash?: true
    social_provider?: true
    social_id?: true
    name?: true
    preferred_payment_seq?: true
    is_verified?: true
    verified_at?: true
    ci?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersCountAggregateInputType = {
    seq?: true
    uuid?: true
    email?: true
    password_hash?: true
    social_provider?: true
    social_id?: true
    name?: true
    preferred_payment_seq?: true
    is_verified?: true
    verified_at?: true
    ci?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    seq: bigint
    uuid: string
    email: string | null
    password_hash: string | null
    social_provider: string
    social_id: string | null
    name: string
    preferred_payment_seq: bigint | null
    is_verified: boolean
    verified_at: Date | null
    ci: string | null
    created_at: Date
    updated_at: Date
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    email?: boolean
    password_hash?: boolean
    social_provider?: boolean
    social_id?: boolean
    name?: boolean
    preferred_payment_seq?: boolean
    is_verified?: boolean
    verified_at?: boolean
    ci?: boolean
    created_at?: boolean
    updated_at?: boolean
    payment_methods?: boolean | users$payment_methodsArgs<ExtArgs>
    user_sessions?: boolean | users$user_sessionsArgs<ExtArgs>
    user_settings?: boolean | users$user_settingsArgs<ExtArgs>
    payment_transactions?: boolean | users$payment_transactionsArgs<ExtArgs>
    identity_verifications?: boolean | users$identity_verificationsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    email?: boolean
    password_hash?: boolean
    social_provider?: boolean
    social_id?: boolean
    name?: boolean
    preferred_payment_seq?: boolean
    is_verified?: boolean
    verified_at?: boolean
    ci?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    email?: boolean
    password_hash?: boolean
    social_provider?: boolean
    social_id?: boolean
    name?: boolean
    preferred_payment_seq?: boolean
    is_verified?: boolean
    verified_at?: boolean
    ci?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    seq?: boolean
    uuid?: boolean
    email?: boolean
    password_hash?: boolean
    social_provider?: boolean
    social_id?: boolean
    name?: boolean
    preferred_payment_seq?: boolean
    is_verified?: boolean
    verified_at?: boolean
    ci?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"seq" | "uuid" | "email" | "password_hash" | "social_provider" | "social_id" | "name" | "preferred_payment_seq" | "is_verified" | "verified_at" | "ci" | "created_at" | "updated_at", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payment_methods?: boolean | users$payment_methodsArgs<ExtArgs>
    user_sessions?: boolean | users$user_sessionsArgs<ExtArgs>
    user_settings?: boolean | users$user_settingsArgs<ExtArgs>
    payment_transactions?: boolean | users$payment_transactionsArgs<ExtArgs>
    identity_verifications?: boolean | users$identity_verificationsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type usersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type usersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      payment_methods: Prisma.$payment_methodsPayload<ExtArgs>[]
      user_sessions: Prisma.$user_sessionsPayload<ExtArgs>[]
      user_settings: Prisma.$user_settingsPayload<ExtArgs> | null
      payment_transactions: Prisma.$payment_transactionsPayload<ExtArgs>[]
      identity_verifications: Prisma.$identity_verificationsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      seq: bigint
      uuid: string
      email: string | null
      password_hash: string | null
      social_provider: string
      social_id: string | null
      name: string
      preferred_payment_seq: bigint | null
      is_verified: boolean
      verified_at: Date | null
      ci: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `seq`
     * const usersWithSeqOnly = await prisma.users.findMany({ select: { seq: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `seq`
     * const usersWithSeqOnly = await prisma.users.createManyAndReturn({
     *   select: { seq: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `seq`
     * const usersWithSeqOnly = await prisma.users.updateManyAndReturn({
     *   select: { seq: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    payment_methods<T extends users$payment_methodsArgs<ExtArgs> = {}>(args?: Subset<T, users$payment_methodsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_sessions<T extends users$user_sessionsArgs<ExtArgs> = {}>(args?: Subset<T, users$user_sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_settings<T extends users$user_settingsArgs<ExtArgs> = {}>(args?: Subset<T, users$user_settingsArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    payment_transactions<T extends users$payment_transactionsArgs<ExtArgs> = {}>(args?: Subset<T, users$payment_transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    identity_verifications<T extends users$identity_verificationsArgs<ExtArgs> = {}>(args?: Subset<T, users$identity_verificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly seq: FieldRef<"users", 'BigInt'>
    readonly uuid: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly password_hash: FieldRef<"users", 'String'>
    readonly social_provider: FieldRef<"users", 'String'>
    readonly social_id: FieldRef<"users", 'String'>
    readonly name: FieldRef<"users", 'String'>
    readonly preferred_payment_seq: FieldRef<"users", 'BigInt'>
    readonly is_verified: FieldRef<"users", 'Boolean'>
    readonly verified_at: FieldRef<"users", 'DateTime'>
    readonly ci: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
    readonly updated_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.payment_methods
   */
  export type users$payment_methodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    where?: payment_methodsWhereInput
    orderBy?: payment_methodsOrderByWithRelationInput | payment_methodsOrderByWithRelationInput[]
    cursor?: payment_methodsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Payment_methodsScalarFieldEnum | Payment_methodsScalarFieldEnum[]
  }

  /**
   * users.user_sessions
   */
  export type users$user_sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    where?: user_sessionsWhereInput
    orderBy?: user_sessionsOrderByWithRelationInput | user_sessionsOrderByWithRelationInput[]
    cursor?: user_sessionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_sessionsScalarFieldEnum | User_sessionsScalarFieldEnum[]
  }

  /**
   * users.user_settings
   */
  export type users$user_settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    where?: user_settingsWhereInput
  }

  /**
   * users.payment_transactions
   */
  export type users$payment_transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    where?: payment_transactionsWhereInput
    orderBy?: payment_transactionsOrderByWithRelationInput | payment_transactionsOrderByWithRelationInput[]
    cursor?: payment_transactionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Payment_transactionsScalarFieldEnum | Payment_transactionsScalarFieldEnum[]
  }

  /**
   * users.identity_verifications
   */
  export type users$identity_verificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    where?: identity_verificationsWhereInput
    orderBy?: identity_verificationsOrderByWithRelationInput | identity_verificationsOrderByWithRelationInput[]
    cursor?: identity_verificationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Identity_verificationsScalarFieldEnum | Identity_verificationsScalarFieldEnum[]
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
  }


  /**
   * Model payment_methods
   */

  export type AggregatePayment_methods = {
    _count: Payment_methodsCountAggregateOutputType | null
    _avg: Payment_methodsAvgAggregateOutputType | null
    _sum: Payment_methodsSumAggregateOutputType | null
    _min: Payment_methodsMinAggregateOutputType | null
    _max: Payment_methodsMaxAggregateOutputType | null
  }

  export type Payment_methodsAvgAggregateOutputType = {
    seq: number | null
  }

  export type Payment_methodsSumAggregateOutputType = {
    seq: bigint | null
  }

  export type Payment_methodsMinAggregateOutputType = {
    seq: bigint | null
    user_uuid: string | null
    type: $Enums.PaymentType | null
    card_number_hash: string | null
    last_4_nums: string | null
    card_holder_name: string | null
    provider_name: string | null
    card_brand: string | null
    expiry_month: string | null
    expiry_year: string | null
    cvv_hash: string | null
    billing_address: string | null
    billing_zip: string | null
    alias: string | null
    is_primary: boolean | null
    billing_key_id: string | null
    billing_key_status: string | null
    operator: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Payment_methodsMaxAggregateOutputType = {
    seq: bigint | null
    user_uuid: string | null
    type: $Enums.PaymentType | null
    card_number_hash: string | null
    last_4_nums: string | null
    card_holder_name: string | null
    provider_name: string | null
    card_brand: string | null
    expiry_month: string | null
    expiry_year: string | null
    cvv_hash: string | null
    billing_address: string | null
    billing_zip: string | null
    alias: string | null
    is_primary: boolean | null
    billing_key_id: string | null
    billing_key_status: string | null
    operator: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Payment_methodsCountAggregateOutputType = {
    seq: number
    user_uuid: number
    type: number
    card_number_hash: number
    last_4_nums: number
    card_holder_name: number
    provider_name: number
    card_brand: number
    expiry_month: number
    expiry_year: number
    cvv_hash: number
    billing_address: number
    billing_zip: number
    alias: number
    is_primary: number
    billing_key_id: number
    billing_key_status: number
    operator: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Payment_methodsAvgAggregateInputType = {
    seq?: true
  }

  export type Payment_methodsSumAggregateInputType = {
    seq?: true
  }

  export type Payment_methodsMinAggregateInputType = {
    seq?: true
    user_uuid?: true
    type?: true
    card_number_hash?: true
    last_4_nums?: true
    card_holder_name?: true
    provider_name?: true
    card_brand?: true
    expiry_month?: true
    expiry_year?: true
    cvv_hash?: true
    billing_address?: true
    billing_zip?: true
    alias?: true
    is_primary?: true
    billing_key_id?: true
    billing_key_status?: true
    operator?: true
    created_at?: true
    updated_at?: true
  }

  export type Payment_methodsMaxAggregateInputType = {
    seq?: true
    user_uuid?: true
    type?: true
    card_number_hash?: true
    last_4_nums?: true
    card_holder_name?: true
    provider_name?: true
    card_brand?: true
    expiry_month?: true
    expiry_year?: true
    cvv_hash?: true
    billing_address?: true
    billing_zip?: true
    alias?: true
    is_primary?: true
    billing_key_id?: true
    billing_key_status?: true
    operator?: true
    created_at?: true
    updated_at?: true
  }

  export type Payment_methodsCountAggregateInputType = {
    seq?: true
    user_uuid?: true
    type?: true
    card_number_hash?: true
    last_4_nums?: true
    card_holder_name?: true
    provider_name?: true
    card_brand?: true
    expiry_month?: true
    expiry_year?: true
    cvv_hash?: true
    billing_address?: true
    billing_zip?: true
    alias?: true
    is_primary?: true
    billing_key_id?: true
    billing_key_status?: true
    operator?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Payment_methodsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which payment_methods to aggregate.
     */
    where?: payment_methodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_methods to fetch.
     */
    orderBy?: payment_methodsOrderByWithRelationInput | payment_methodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: payment_methodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_methods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_methods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned payment_methods
    **/
    _count?: true | Payment_methodsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Payment_methodsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Payment_methodsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Payment_methodsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Payment_methodsMaxAggregateInputType
  }

  export type GetPayment_methodsAggregateType<T extends Payment_methodsAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment_methods]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment_methods[P]>
      : GetScalarType<T[P], AggregatePayment_methods[P]>
  }




  export type payment_methodsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: payment_methodsWhereInput
    orderBy?: payment_methodsOrderByWithAggregationInput | payment_methodsOrderByWithAggregationInput[]
    by: Payment_methodsScalarFieldEnum[] | Payment_methodsScalarFieldEnum
    having?: payment_methodsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Payment_methodsCountAggregateInputType | true
    _avg?: Payment_methodsAvgAggregateInputType
    _sum?: Payment_methodsSumAggregateInputType
    _min?: Payment_methodsMinAggregateInputType
    _max?: Payment_methodsMaxAggregateInputType
  }

  export type Payment_methodsGroupByOutputType = {
    seq: bigint
    user_uuid: string
    type: $Enums.PaymentType
    card_number_hash: string | null
    last_4_nums: string
    card_holder_name: string | null
    provider_name: string
    card_brand: string | null
    expiry_month: string | null
    expiry_year: string | null
    cvv_hash: string | null
    billing_address: string | null
    billing_zip: string | null
    alias: string | null
    is_primary: boolean
    billing_key_id: string | null
    billing_key_status: string | null
    operator: string | null
    created_at: Date
    updated_at: Date
    _count: Payment_methodsCountAggregateOutputType | null
    _avg: Payment_methodsAvgAggregateOutputType | null
    _sum: Payment_methodsSumAggregateOutputType | null
    _min: Payment_methodsMinAggregateOutputType | null
    _max: Payment_methodsMaxAggregateOutputType | null
  }

  type GetPayment_methodsGroupByPayload<T extends payment_methodsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Payment_methodsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Payment_methodsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Payment_methodsGroupByOutputType[P]>
            : GetScalarType<T[P], Payment_methodsGroupByOutputType[P]>
        }
      >
    >


  export type payment_methodsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    user_uuid?: boolean
    type?: boolean
    card_number_hash?: boolean
    last_4_nums?: boolean
    card_holder_name?: boolean
    provider_name?: boolean
    card_brand?: boolean
    expiry_month?: boolean
    expiry_year?: boolean
    cvv_hash?: boolean
    billing_address?: boolean
    billing_zip?: boolean
    alias?: boolean
    is_primary?: boolean
    billing_key_id?: boolean
    billing_key_status?: boolean
    operator?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment_methods"]>

  export type payment_methodsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    user_uuid?: boolean
    type?: boolean
    card_number_hash?: boolean
    last_4_nums?: boolean
    card_holder_name?: boolean
    provider_name?: boolean
    card_brand?: boolean
    expiry_month?: boolean
    expiry_year?: boolean
    cvv_hash?: boolean
    billing_address?: boolean
    billing_zip?: boolean
    alias?: boolean
    is_primary?: boolean
    billing_key_id?: boolean
    billing_key_status?: boolean
    operator?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment_methods"]>

  export type payment_methodsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    user_uuid?: boolean
    type?: boolean
    card_number_hash?: boolean
    last_4_nums?: boolean
    card_holder_name?: boolean
    provider_name?: boolean
    card_brand?: boolean
    expiry_month?: boolean
    expiry_year?: boolean
    cvv_hash?: boolean
    billing_address?: boolean
    billing_zip?: boolean
    alias?: boolean
    is_primary?: boolean
    billing_key_id?: boolean
    billing_key_status?: boolean
    operator?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment_methods"]>

  export type payment_methodsSelectScalar = {
    seq?: boolean
    user_uuid?: boolean
    type?: boolean
    card_number_hash?: boolean
    last_4_nums?: boolean
    card_holder_name?: boolean
    provider_name?: boolean
    card_brand?: boolean
    expiry_month?: boolean
    expiry_year?: boolean
    cvv_hash?: boolean
    billing_address?: boolean
    billing_zip?: boolean
    alias?: boolean
    is_primary?: boolean
    billing_key_id?: boolean
    billing_key_status?: boolean
    operator?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type payment_methodsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"seq" | "user_uuid" | "type" | "card_number_hash" | "last_4_nums" | "card_holder_name" | "provider_name" | "card_brand" | "expiry_month" | "expiry_year" | "cvv_hash" | "billing_address" | "billing_zip" | "alias" | "is_primary" | "billing_key_id" | "billing_key_status" | "operator" | "created_at" | "updated_at", ExtArgs["result"]["payment_methods"]>
  export type payment_methodsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type payment_methodsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type payment_methodsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $payment_methodsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "payment_methods"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      seq: bigint
      user_uuid: string
      type: $Enums.PaymentType
      card_number_hash: string | null
      last_4_nums: string
      card_holder_name: string | null
      provider_name: string
      card_brand: string | null
      expiry_month: string | null
      expiry_year: string | null
      cvv_hash: string | null
      billing_address: string | null
      billing_zip: string | null
      alias: string | null
      is_primary: boolean
      billing_key_id: string | null
      billing_key_status: string | null
      operator: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["payment_methods"]>
    composites: {}
  }

  type payment_methodsGetPayload<S extends boolean | null | undefined | payment_methodsDefaultArgs> = $Result.GetResult<Prisma.$payment_methodsPayload, S>

  type payment_methodsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<payment_methodsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Payment_methodsCountAggregateInputType | true
    }

  export interface payment_methodsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['payment_methods'], meta: { name: 'payment_methods' } }
    /**
     * Find zero or one Payment_methods that matches the filter.
     * @param {payment_methodsFindUniqueArgs} args - Arguments to find a Payment_methods
     * @example
     * // Get one Payment_methods
     * const payment_methods = await prisma.payment_methods.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends payment_methodsFindUniqueArgs>(args: SelectSubset<T, payment_methodsFindUniqueArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment_methods that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {payment_methodsFindUniqueOrThrowArgs} args - Arguments to find a Payment_methods
     * @example
     * // Get one Payment_methods
     * const payment_methods = await prisma.payment_methods.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends payment_methodsFindUniqueOrThrowArgs>(args: SelectSubset<T, payment_methodsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment_methods that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_methodsFindFirstArgs} args - Arguments to find a Payment_methods
     * @example
     * // Get one Payment_methods
     * const payment_methods = await prisma.payment_methods.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends payment_methodsFindFirstArgs>(args?: SelectSubset<T, payment_methodsFindFirstArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment_methods that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_methodsFindFirstOrThrowArgs} args - Arguments to find a Payment_methods
     * @example
     * // Get one Payment_methods
     * const payment_methods = await prisma.payment_methods.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends payment_methodsFindFirstOrThrowArgs>(args?: SelectSubset<T, payment_methodsFindFirstOrThrowArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payment_methods that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_methodsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payment_methods
     * const payment_methods = await prisma.payment_methods.findMany()
     * 
     * // Get first 10 Payment_methods
     * const payment_methods = await prisma.payment_methods.findMany({ take: 10 })
     * 
     * // Only select the `seq`
     * const payment_methodsWithSeqOnly = await prisma.payment_methods.findMany({ select: { seq: true } })
     * 
     */
    findMany<T extends payment_methodsFindManyArgs>(args?: SelectSubset<T, payment_methodsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment_methods.
     * @param {payment_methodsCreateArgs} args - Arguments to create a Payment_methods.
     * @example
     * // Create one Payment_methods
     * const Payment_methods = await prisma.payment_methods.create({
     *   data: {
     *     // ... data to create a Payment_methods
     *   }
     * })
     * 
     */
    create<T extends payment_methodsCreateArgs>(args: SelectSubset<T, payment_methodsCreateArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payment_methods.
     * @param {payment_methodsCreateManyArgs} args - Arguments to create many Payment_methods.
     * @example
     * // Create many Payment_methods
     * const payment_methods = await prisma.payment_methods.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends payment_methodsCreateManyArgs>(args?: SelectSubset<T, payment_methodsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payment_methods and returns the data saved in the database.
     * @param {payment_methodsCreateManyAndReturnArgs} args - Arguments to create many Payment_methods.
     * @example
     * // Create many Payment_methods
     * const payment_methods = await prisma.payment_methods.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payment_methods and only return the `seq`
     * const payment_methodsWithSeqOnly = await prisma.payment_methods.createManyAndReturn({
     *   select: { seq: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends payment_methodsCreateManyAndReturnArgs>(args?: SelectSubset<T, payment_methodsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment_methods.
     * @param {payment_methodsDeleteArgs} args - Arguments to delete one Payment_methods.
     * @example
     * // Delete one Payment_methods
     * const Payment_methods = await prisma.payment_methods.delete({
     *   where: {
     *     // ... filter to delete one Payment_methods
     *   }
     * })
     * 
     */
    delete<T extends payment_methodsDeleteArgs>(args: SelectSubset<T, payment_methodsDeleteArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment_methods.
     * @param {payment_methodsUpdateArgs} args - Arguments to update one Payment_methods.
     * @example
     * // Update one Payment_methods
     * const payment_methods = await prisma.payment_methods.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends payment_methodsUpdateArgs>(args: SelectSubset<T, payment_methodsUpdateArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payment_methods.
     * @param {payment_methodsDeleteManyArgs} args - Arguments to filter Payment_methods to delete.
     * @example
     * // Delete a few Payment_methods
     * const { count } = await prisma.payment_methods.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends payment_methodsDeleteManyArgs>(args?: SelectSubset<T, payment_methodsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payment_methods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_methodsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payment_methods
     * const payment_methods = await prisma.payment_methods.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends payment_methodsUpdateManyArgs>(args: SelectSubset<T, payment_methodsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payment_methods and returns the data updated in the database.
     * @param {payment_methodsUpdateManyAndReturnArgs} args - Arguments to update many Payment_methods.
     * @example
     * // Update many Payment_methods
     * const payment_methods = await prisma.payment_methods.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payment_methods and only return the `seq`
     * const payment_methodsWithSeqOnly = await prisma.payment_methods.updateManyAndReturn({
     *   select: { seq: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends payment_methodsUpdateManyAndReturnArgs>(args: SelectSubset<T, payment_methodsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment_methods.
     * @param {payment_methodsUpsertArgs} args - Arguments to update or create a Payment_methods.
     * @example
     * // Update or create a Payment_methods
     * const payment_methods = await prisma.payment_methods.upsert({
     *   create: {
     *     // ... data to create a Payment_methods
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment_methods we want to update
     *   }
     * })
     */
    upsert<T extends payment_methodsUpsertArgs>(args: SelectSubset<T, payment_methodsUpsertArgs<ExtArgs>>): Prisma__payment_methodsClient<$Result.GetResult<Prisma.$payment_methodsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payment_methods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_methodsCountArgs} args - Arguments to filter Payment_methods to count.
     * @example
     * // Count the number of Payment_methods
     * const count = await prisma.payment_methods.count({
     *   where: {
     *     // ... the filter for the Payment_methods we want to count
     *   }
     * })
    **/
    count<T extends payment_methodsCountArgs>(
      args?: Subset<T, payment_methodsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Payment_methodsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment_methods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Payment_methodsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Payment_methodsAggregateArgs>(args: Subset<T, Payment_methodsAggregateArgs>): Prisma.PrismaPromise<GetPayment_methodsAggregateType<T>>

    /**
     * Group by Payment_methods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_methodsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends payment_methodsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: payment_methodsGroupByArgs['orderBy'] }
        : { orderBy?: payment_methodsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, payment_methodsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayment_methodsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the payment_methods model
   */
  readonly fields: payment_methodsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for payment_methods.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__payment_methodsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the payment_methods model
   */
  interface payment_methodsFieldRefs {
    readonly seq: FieldRef<"payment_methods", 'BigInt'>
    readonly user_uuid: FieldRef<"payment_methods", 'String'>
    readonly type: FieldRef<"payment_methods", 'PaymentType'>
    readonly card_number_hash: FieldRef<"payment_methods", 'String'>
    readonly last_4_nums: FieldRef<"payment_methods", 'String'>
    readonly card_holder_name: FieldRef<"payment_methods", 'String'>
    readonly provider_name: FieldRef<"payment_methods", 'String'>
    readonly card_brand: FieldRef<"payment_methods", 'String'>
    readonly expiry_month: FieldRef<"payment_methods", 'String'>
    readonly expiry_year: FieldRef<"payment_methods", 'String'>
    readonly cvv_hash: FieldRef<"payment_methods", 'String'>
    readonly billing_address: FieldRef<"payment_methods", 'String'>
    readonly billing_zip: FieldRef<"payment_methods", 'String'>
    readonly alias: FieldRef<"payment_methods", 'String'>
    readonly is_primary: FieldRef<"payment_methods", 'Boolean'>
    readonly billing_key_id: FieldRef<"payment_methods", 'String'>
    readonly billing_key_status: FieldRef<"payment_methods", 'String'>
    readonly operator: FieldRef<"payment_methods", 'String'>
    readonly created_at: FieldRef<"payment_methods", 'DateTime'>
    readonly updated_at: FieldRef<"payment_methods", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * payment_methods findUnique
   */
  export type payment_methodsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * Filter, which payment_methods to fetch.
     */
    where: payment_methodsWhereUniqueInput
  }

  /**
   * payment_methods findUniqueOrThrow
   */
  export type payment_methodsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * Filter, which payment_methods to fetch.
     */
    where: payment_methodsWhereUniqueInput
  }

  /**
   * payment_methods findFirst
   */
  export type payment_methodsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * Filter, which payment_methods to fetch.
     */
    where?: payment_methodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_methods to fetch.
     */
    orderBy?: payment_methodsOrderByWithRelationInput | payment_methodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for payment_methods.
     */
    cursor?: payment_methodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_methods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_methods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of payment_methods.
     */
    distinct?: Payment_methodsScalarFieldEnum | Payment_methodsScalarFieldEnum[]
  }

  /**
   * payment_methods findFirstOrThrow
   */
  export type payment_methodsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * Filter, which payment_methods to fetch.
     */
    where?: payment_methodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_methods to fetch.
     */
    orderBy?: payment_methodsOrderByWithRelationInput | payment_methodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for payment_methods.
     */
    cursor?: payment_methodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_methods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_methods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of payment_methods.
     */
    distinct?: Payment_methodsScalarFieldEnum | Payment_methodsScalarFieldEnum[]
  }

  /**
   * payment_methods findMany
   */
  export type payment_methodsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * Filter, which payment_methods to fetch.
     */
    where?: payment_methodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_methods to fetch.
     */
    orderBy?: payment_methodsOrderByWithRelationInput | payment_methodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing payment_methods.
     */
    cursor?: payment_methodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_methods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_methods.
     */
    skip?: number
    distinct?: Payment_methodsScalarFieldEnum | Payment_methodsScalarFieldEnum[]
  }

  /**
   * payment_methods create
   */
  export type payment_methodsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * The data needed to create a payment_methods.
     */
    data: XOR<payment_methodsCreateInput, payment_methodsUncheckedCreateInput>
  }

  /**
   * payment_methods createMany
   */
  export type payment_methodsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many payment_methods.
     */
    data: payment_methodsCreateManyInput | payment_methodsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * payment_methods createManyAndReturn
   */
  export type payment_methodsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * The data used to create many payment_methods.
     */
    data: payment_methodsCreateManyInput | payment_methodsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * payment_methods update
   */
  export type payment_methodsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * The data needed to update a payment_methods.
     */
    data: XOR<payment_methodsUpdateInput, payment_methodsUncheckedUpdateInput>
    /**
     * Choose, which payment_methods to update.
     */
    where: payment_methodsWhereUniqueInput
  }

  /**
   * payment_methods updateMany
   */
  export type payment_methodsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update payment_methods.
     */
    data: XOR<payment_methodsUpdateManyMutationInput, payment_methodsUncheckedUpdateManyInput>
    /**
     * Filter which payment_methods to update
     */
    where?: payment_methodsWhereInput
    /**
     * Limit how many payment_methods to update.
     */
    limit?: number
  }

  /**
   * payment_methods updateManyAndReturn
   */
  export type payment_methodsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * The data used to update payment_methods.
     */
    data: XOR<payment_methodsUpdateManyMutationInput, payment_methodsUncheckedUpdateManyInput>
    /**
     * Filter which payment_methods to update
     */
    where?: payment_methodsWhereInput
    /**
     * Limit how many payment_methods to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * payment_methods upsert
   */
  export type payment_methodsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * The filter to search for the payment_methods to update in case it exists.
     */
    where: payment_methodsWhereUniqueInput
    /**
     * In case the payment_methods found by the `where` argument doesn't exist, create a new payment_methods with this data.
     */
    create: XOR<payment_methodsCreateInput, payment_methodsUncheckedCreateInput>
    /**
     * In case the payment_methods was found with the provided `where` argument, update it with this data.
     */
    update: XOR<payment_methodsUpdateInput, payment_methodsUncheckedUpdateInput>
  }

  /**
   * payment_methods delete
   */
  export type payment_methodsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
    /**
     * Filter which payment_methods to delete.
     */
    where: payment_methodsWhereUniqueInput
  }

  /**
   * payment_methods deleteMany
   */
  export type payment_methodsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which payment_methods to delete
     */
    where?: payment_methodsWhereInput
    /**
     * Limit how many payment_methods to delete.
     */
    limit?: number
  }

  /**
   * payment_methods without action
   */
  export type payment_methodsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_methods
     */
    select?: payment_methodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_methods
     */
    omit?: payment_methodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_methodsInclude<ExtArgs> | null
  }


  /**
   * Model user_sessions
   */

  export type AggregateUser_sessions = {
    _count: User_sessionsCountAggregateOutputType | null
    _avg: User_sessionsAvgAggregateOutputType | null
    _sum: User_sessionsSumAggregateOutputType | null
    _min: User_sessionsMinAggregateOutputType | null
    _max: User_sessionsMaxAggregateOutputType | null
  }

  export type User_sessionsAvgAggregateOutputType = {
    seq: number | null
    user_seq: number | null
  }

  export type User_sessionsSumAggregateOutputType = {
    seq: bigint | null
    user_seq: bigint | null
  }

  export type User_sessionsMinAggregateOutputType = {
    seq: bigint | null
    user_seq: bigint | null
    access_token: string | null
    refresh_token: string | null
    expires_at: Date | null
    device_info: string | null
    created_at: Date | null
  }

  export type User_sessionsMaxAggregateOutputType = {
    seq: bigint | null
    user_seq: bigint | null
    access_token: string | null
    refresh_token: string | null
    expires_at: Date | null
    device_info: string | null
    created_at: Date | null
  }

  export type User_sessionsCountAggregateOutputType = {
    seq: number
    user_seq: number
    access_token: number
    refresh_token: number
    expires_at: number
    device_info: number
    created_at: number
    _all: number
  }


  export type User_sessionsAvgAggregateInputType = {
    seq?: true
    user_seq?: true
  }

  export type User_sessionsSumAggregateInputType = {
    seq?: true
    user_seq?: true
  }

  export type User_sessionsMinAggregateInputType = {
    seq?: true
    user_seq?: true
    access_token?: true
    refresh_token?: true
    expires_at?: true
    device_info?: true
    created_at?: true
  }

  export type User_sessionsMaxAggregateInputType = {
    seq?: true
    user_seq?: true
    access_token?: true
    refresh_token?: true
    expires_at?: true
    device_info?: true
    created_at?: true
  }

  export type User_sessionsCountAggregateInputType = {
    seq?: true
    user_seq?: true
    access_token?: true
    refresh_token?: true
    expires_at?: true
    device_info?: true
    created_at?: true
    _all?: true
  }

  export type User_sessionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_sessions to aggregate.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionsOrderByWithRelationInput | user_sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_sessions
    **/
    _count?: true | User_sessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_sessionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_sessionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_sessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_sessionsMaxAggregateInputType
  }

  export type GetUser_sessionsAggregateType<T extends User_sessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_sessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_sessions[P]>
      : GetScalarType<T[P], AggregateUser_sessions[P]>
  }




  export type user_sessionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_sessionsWhereInput
    orderBy?: user_sessionsOrderByWithAggregationInput | user_sessionsOrderByWithAggregationInput[]
    by: User_sessionsScalarFieldEnum[] | User_sessionsScalarFieldEnum
    having?: user_sessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_sessionsCountAggregateInputType | true
    _avg?: User_sessionsAvgAggregateInputType
    _sum?: User_sessionsSumAggregateInputType
    _min?: User_sessionsMinAggregateInputType
    _max?: User_sessionsMaxAggregateInputType
  }

  export type User_sessionsGroupByOutputType = {
    seq: bigint
    user_seq: bigint
    access_token: string
    refresh_token: string
    expires_at: Date
    device_info: string | null
    created_at: Date
    _count: User_sessionsCountAggregateOutputType | null
    _avg: User_sessionsAvgAggregateOutputType | null
    _sum: User_sessionsSumAggregateOutputType | null
    _min: User_sessionsMinAggregateOutputType | null
    _max: User_sessionsMaxAggregateOutputType | null
  }

  type GetUser_sessionsGroupByPayload<T extends user_sessionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_sessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_sessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_sessionsGroupByOutputType[P]>
            : GetScalarType<T[P], User_sessionsGroupByOutputType[P]>
        }
      >
    >


  export type user_sessionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    user_seq?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires_at?: boolean
    device_info?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_sessions"]>

  export type user_sessionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    user_seq?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires_at?: boolean
    device_info?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_sessions"]>

  export type user_sessionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    user_seq?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires_at?: boolean
    device_info?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_sessions"]>

  export type user_sessionsSelectScalar = {
    seq?: boolean
    user_seq?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expires_at?: boolean
    device_info?: boolean
    created_at?: boolean
  }

  export type user_sessionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"seq" | "user_seq" | "access_token" | "refresh_token" | "expires_at" | "device_info" | "created_at", ExtArgs["result"]["user_sessions"]>
  export type user_sessionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type user_sessionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type user_sessionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $user_sessionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_sessions"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      seq: bigint
      user_seq: bigint
      access_token: string
      refresh_token: string
      expires_at: Date
      device_info: string | null
      created_at: Date
    }, ExtArgs["result"]["user_sessions"]>
    composites: {}
  }

  type user_sessionsGetPayload<S extends boolean | null | undefined | user_sessionsDefaultArgs> = $Result.GetResult<Prisma.$user_sessionsPayload, S>

  type user_sessionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_sessionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: User_sessionsCountAggregateInputType | true
    }

  export interface user_sessionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_sessions'], meta: { name: 'user_sessions' } }
    /**
     * Find zero or one User_sessions that matches the filter.
     * @param {user_sessionsFindUniqueArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_sessionsFindUniqueArgs>(args: SelectSubset<T, user_sessionsFindUniqueArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_sessions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_sessionsFindUniqueOrThrowArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_sessionsFindUniqueOrThrowArgs>(args: SelectSubset<T, user_sessionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsFindFirstArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_sessionsFindFirstArgs>(args?: SelectSubset<T, user_sessionsFindFirstArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_sessions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsFindFirstOrThrowArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_sessionsFindFirstOrThrowArgs>(args?: SelectSubset<T, user_sessionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_sessions
     * const user_sessions = await prisma.user_sessions.findMany()
     * 
     * // Get first 10 User_sessions
     * const user_sessions = await prisma.user_sessions.findMany({ take: 10 })
     * 
     * // Only select the `seq`
     * const user_sessionsWithSeqOnly = await prisma.user_sessions.findMany({ select: { seq: true } })
     * 
     */
    findMany<T extends user_sessionsFindManyArgs>(args?: SelectSubset<T, user_sessionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_sessions.
     * @param {user_sessionsCreateArgs} args - Arguments to create a User_sessions.
     * @example
     * // Create one User_sessions
     * const User_sessions = await prisma.user_sessions.create({
     *   data: {
     *     // ... data to create a User_sessions
     *   }
     * })
     * 
     */
    create<T extends user_sessionsCreateArgs>(args: SelectSubset<T, user_sessionsCreateArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_sessions.
     * @param {user_sessionsCreateManyArgs} args - Arguments to create many User_sessions.
     * @example
     * // Create many User_sessions
     * const user_sessions = await prisma.user_sessions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_sessionsCreateManyArgs>(args?: SelectSubset<T, user_sessionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_sessions and returns the data saved in the database.
     * @param {user_sessionsCreateManyAndReturnArgs} args - Arguments to create many User_sessions.
     * @example
     * // Create many User_sessions
     * const user_sessions = await prisma.user_sessions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_sessions and only return the `seq`
     * const user_sessionsWithSeqOnly = await prisma.user_sessions.createManyAndReturn({
     *   select: { seq: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_sessionsCreateManyAndReturnArgs>(args?: SelectSubset<T, user_sessionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User_sessions.
     * @param {user_sessionsDeleteArgs} args - Arguments to delete one User_sessions.
     * @example
     * // Delete one User_sessions
     * const User_sessions = await prisma.user_sessions.delete({
     *   where: {
     *     // ... filter to delete one User_sessions
     *   }
     * })
     * 
     */
    delete<T extends user_sessionsDeleteArgs>(args: SelectSubset<T, user_sessionsDeleteArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_sessions.
     * @param {user_sessionsUpdateArgs} args - Arguments to update one User_sessions.
     * @example
     * // Update one User_sessions
     * const user_sessions = await prisma.user_sessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_sessionsUpdateArgs>(args: SelectSubset<T, user_sessionsUpdateArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_sessions.
     * @param {user_sessionsDeleteManyArgs} args - Arguments to filter User_sessions to delete.
     * @example
     * // Delete a few User_sessions
     * const { count } = await prisma.user_sessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_sessionsDeleteManyArgs>(args?: SelectSubset<T, user_sessionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_sessions
     * const user_sessions = await prisma.user_sessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_sessionsUpdateManyArgs>(args: SelectSubset<T, user_sessionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_sessions and returns the data updated in the database.
     * @param {user_sessionsUpdateManyAndReturnArgs} args - Arguments to update many User_sessions.
     * @example
     * // Update many User_sessions
     * const user_sessions = await prisma.user_sessions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more User_sessions and only return the `seq`
     * const user_sessionsWithSeqOnly = await prisma.user_sessions.updateManyAndReturn({
     *   select: { seq: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends user_sessionsUpdateManyAndReturnArgs>(args: SelectSubset<T, user_sessionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User_sessions.
     * @param {user_sessionsUpsertArgs} args - Arguments to update or create a User_sessions.
     * @example
     * // Update or create a User_sessions
     * const user_sessions = await prisma.user_sessions.upsert({
     *   create: {
     *     // ... data to create a User_sessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_sessions we want to update
     *   }
     * })
     */
    upsert<T extends user_sessionsUpsertArgs>(args: SelectSubset<T, user_sessionsUpsertArgs<ExtArgs>>): Prisma__user_sessionsClient<$Result.GetResult<Prisma.$user_sessionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsCountArgs} args - Arguments to filter User_sessions to count.
     * @example
     * // Count the number of User_sessions
     * const count = await prisma.user_sessions.count({
     *   where: {
     *     // ... the filter for the User_sessions we want to count
     *   }
     * })
    **/
    count<T extends user_sessionsCountArgs>(
      args?: Subset<T, user_sessionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_sessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_sessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_sessionsAggregateArgs>(args: Subset<T, User_sessionsAggregateArgs>): Prisma.PrismaPromise<GetUser_sessionsAggregateType<T>>

    /**
     * Group by User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_sessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_sessionsGroupByArgs['orderBy'] }
        : { orderBy?: user_sessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_sessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_sessionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_sessions model
   */
  readonly fields: user_sessionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_sessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_sessionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_sessions model
   */
  interface user_sessionsFieldRefs {
    readonly seq: FieldRef<"user_sessions", 'BigInt'>
    readonly user_seq: FieldRef<"user_sessions", 'BigInt'>
    readonly access_token: FieldRef<"user_sessions", 'String'>
    readonly refresh_token: FieldRef<"user_sessions", 'String'>
    readonly expires_at: FieldRef<"user_sessions", 'DateTime'>
    readonly device_info: FieldRef<"user_sessions", 'String'>
    readonly created_at: FieldRef<"user_sessions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_sessions findUnique
   */
  export type user_sessionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where: user_sessionsWhereUniqueInput
  }

  /**
   * user_sessions findUniqueOrThrow
   */
  export type user_sessionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where: user_sessionsWhereUniqueInput
  }

  /**
   * user_sessions findFirst
   */
  export type user_sessionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionsOrderByWithRelationInput | user_sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_sessions.
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_sessions.
     */
    distinct?: User_sessionsScalarFieldEnum | User_sessionsScalarFieldEnum[]
  }

  /**
   * user_sessions findFirstOrThrow
   */
  export type user_sessionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionsOrderByWithRelationInput | user_sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_sessions.
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_sessions.
     */
    distinct?: User_sessionsScalarFieldEnum | User_sessionsScalarFieldEnum[]
  }

  /**
   * user_sessions findMany
   */
  export type user_sessionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionsOrderByWithRelationInput | user_sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_sessions.
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    distinct?: User_sessionsScalarFieldEnum | User_sessionsScalarFieldEnum[]
  }

  /**
   * user_sessions create
   */
  export type user_sessionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * The data needed to create a user_sessions.
     */
    data: XOR<user_sessionsCreateInput, user_sessionsUncheckedCreateInput>
  }

  /**
   * user_sessions createMany
   */
  export type user_sessionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_sessions.
     */
    data: user_sessionsCreateManyInput | user_sessionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_sessions createManyAndReturn
   */
  export type user_sessionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * The data used to create many user_sessions.
     */
    data: user_sessionsCreateManyInput | user_sessionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_sessions update
   */
  export type user_sessionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * The data needed to update a user_sessions.
     */
    data: XOR<user_sessionsUpdateInput, user_sessionsUncheckedUpdateInput>
    /**
     * Choose, which user_sessions to update.
     */
    where: user_sessionsWhereUniqueInput
  }

  /**
   * user_sessions updateMany
   */
  export type user_sessionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_sessions.
     */
    data: XOR<user_sessionsUpdateManyMutationInput, user_sessionsUncheckedUpdateManyInput>
    /**
     * Filter which user_sessions to update
     */
    where?: user_sessionsWhereInput
    /**
     * Limit how many user_sessions to update.
     */
    limit?: number
  }

  /**
   * user_sessions updateManyAndReturn
   */
  export type user_sessionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * The data used to update user_sessions.
     */
    data: XOR<user_sessionsUpdateManyMutationInput, user_sessionsUncheckedUpdateManyInput>
    /**
     * Filter which user_sessions to update
     */
    where?: user_sessionsWhereInput
    /**
     * Limit how many user_sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_sessions upsert
   */
  export type user_sessionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * The filter to search for the user_sessions to update in case it exists.
     */
    where: user_sessionsWhereUniqueInput
    /**
     * In case the user_sessions found by the `where` argument doesn't exist, create a new user_sessions with this data.
     */
    create: XOR<user_sessionsCreateInput, user_sessionsUncheckedCreateInput>
    /**
     * In case the user_sessions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_sessionsUpdateInput, user_sessionsUncheckedUpdateInput>
  }

  /**
   * user_sessions delete
   */
  export type user_sessionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter which user_sessions to delete.
     */
    where: user_sessionsWhereUniqueInput
  }

  /**
   * user_sessions deleteMany
   */
  export type user_sessionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_sessions to delete
     */
    where?: user_sessionsWhereInput
    /**
     * Limit how many user_sessions to delete.
     */
    limit?: number
  }

  /**
   * user_sessions without action
   */
  export type user_sessionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_sessions
     */
    omit?: user_sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_sessionsInclude<ExtArgs> | null
  }


  /**
   * Model user_settings
   */

  export type AggregateUser_settings = {
    _count: User_settingsCountAggregateOutputType | null
    _avg: User_settingsAvgAggregateOutputType | null
    _sum: User_settingsSumAggregateOutputType | null
    _min: User_settingsMinAggregateOutputType | null
    _max: User_settingsMaxAggregateOutputType | null
  }

  export type User_settingsAvgAggregateOutputType = {
    user_seq: number | null
  }

  export type User_settingsSumAggregateOutputType = {
    user_seq: bigint | null
  }

  export type User_settingsMinAggregateOutputType = {
    user_seq: bigint | null
    dark_mode: boolean | null
    notification_enabled: boolean | null
    compare_mode: string | null
    currency_preference: string | null
    updated_at: Date | null
  }

  export type User_settingsMaxAggregateOutputType = {
    user_seq: bigint | null
    dark_mode: boolean | null
    notification_enabled: boolean | null
    compare_mode: string | null
    currency_preference: string | null
    updated_at: Date | null
  }

  export type User_settingsCountAggregateOutputType = {
    user_seq: number
    dark_mode: number
    notification_enabled: number
    compare_mode: number
    currency_preference: number
    updated_at: number
    _all: number
  }


  export type User_settingsAvgAggregateInputType = {
    user_seq?: true
  }

  export type User_settingsSumAggregateInputType = {
    user_seq?: true
  }

  export type User_settingsMinAggregateInputType = {
    user_seq?: true
    dark_mode?: true
    notification_enabled?: true
    compare_mode?: true
    currency_preference?: true
    updated_at?: true
  }

  export type User_settingsMaxAggregateInputType = {
    user_seq?: true
    dark_mode?: true
    notification_enabled?: true
    compare_mode?: true
    currency_preference?: true
    updated_at?: true
  }

  export type User_settingsCountAggregateInputType = {
    user_seq?: true
    dark_mode?: true
    notification_enabled?: true
    compare_mode?: true
    currency_preference?: true
    updated_at?: true
    _all?: true
  }

  export type User_settingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_settings to aggregate.
     */
    where?: user_settingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_settings to fetch.
     */
    orderBy?: user_settingsOrderByWithRelationInput | user_settingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_settingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_settings
    **/
    _count?: true | User_settingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_settingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_settingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_settingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_settingsMaxAggregateInputType
  }

  export type GetUser_settingsAggregateType<T extends User_settingsAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_settings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_settings[P]>
      : GetScalarType<T[P], AggregateUser_settings[P]>
  }




  export type user_settingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_settingsWhereInput
    orderBy?: user_settingsOrderByWithAggregationInput | user_settingsOrderByWithAggregationInput[]
    by: User_settingsScalarFieldEnum[] | User_settingsScalarFieldEnum
    having?: user_settingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_settingsCountAggregateInputType | true
    _avg?: User_settingsAvgAggregateInputType
    _sum?: User_settingsSumAggregateInputType
    _min?: User_settingsMinAggregateInputType
    _max?: User_settingsMaxAggregateInputType
  }

  export type User_settingsGroupByOutputType = {
    user_seq: bigint
    dark_mode: boolean
    notification_enabled: boolean
    compare_mode: string
    currency_preference: string
    updated_at: Date
    _count: User_settingsCountAggregateOutputType | null
    _avg: User_settingsAvgAggregateOutputType | null
    _sum: User_settingsSumAggregateOutputType | null
    _min: User_settingsMinAggregateOutputType | null
    _max: User_settingsMaxAggregateOutputType | null
  }

  type GetUser_settingsGroupByPayload<T extends user_settingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_settingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_settingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_settingsGroupByOutputType[P]>
            : GetScalarType<T[P], User_settingsGroupByOutputType[P]>
        }
      >
    >


  export type user_settingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_seq?: boolean
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: boolean
    currency_preference?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_settings"]>

  export type user_settingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_seq?: boolean
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: boolean
    currency_preference?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_settings"]>

  export type user_settingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_seq?: boolean
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: boolean
    currency_preference?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_settings"]>

  export type user_settingsSelectScalar = {
    user_seq?: boolean
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: boolean
    currency_preference?: boolean
    updated_at?: boolean
  }

  export type user_settingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_seq" | "dark_mode" | "notification_enabled" | "compare_mode" | "currency_preference" | "updated_at", ExtArgs["result"]["user_settings"]>
  export type user_settingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type user_settingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type user_settingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $user_settingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_settings"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_seq: bigint
      dark_mode: boolean
      notification_enabled: boolean
      compare_mode: string
      currency_preference: string
      updated_at: Date
    }, ExtArgs["result"]["user_settings"]>
    composites: {}
  }

  type user_settingsGetPayload<S extends boolean | null | undefined | user_settingsDefaultArgs> = $Result.GetResult<Prisma.$user_settingsPayload, S>

  type user_settingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_settingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: User_settingsCountAggregateInputType | true
    }

  export interface user_settingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_settings'], meta: { name: 'user_settings' } }
    /**
     * Find zero or one User_settings that matches the filter.
     * @param {user_settingsFindUniqueArgs} args - Arguments to find a User_settings
     * @example
     * // Get one User_settings
     * const user_settings = await prisma.user_settings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_settingsFindUniqueArgs>(args: SelectSubset<T, user_settingsFindUniqueArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_settings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_settingsFindUniqueOrThrowArgs} args - Arguments to find a User_settings
     * @example
     * // Get one User_settings
     * const user_settings = await prisma.user_settings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_settingsFindUniqueOrThrowArgs>(args: SelectSubset<T, user_settingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_settingsFindFirstArgs} args - Arguments to find a User_settings
     * @example
     * // Get one User_settings
     * const user_settings = await prisma.user_settings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_settingsFindFirstArgs>(args?: SelectSubset<T, user_settingsFindFirstArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_settings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_settingsFindFirstOrThrowArgs} args - Arguments to find a User_settings
     * @example
     * // Get one User_settings
     * const user_settings = await prisma.user_settings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_settingsFindFirstOrThrowArgs>(args?: SelectSubset<T, user_settingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_settingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_settings
     * const user_settings = await prisma.user_settings.findMany()
     * 
     * // Get first 10 User_settings
     * const user_settings = await prisma.user_settings.findMany({ take: 10 })
     * 
     * // Only select the `user_seq`
     * const user_settingsWithUser_seqOnly = await prisma.user_settings.findMany({ select: { user_seq: true } })
     * 
     */
    findMany<T extends user_settingsFindManyArgs>(args?: SelectSubset<T, user_settingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_settings.
     * @param {user_settingsCreateArgs} args - Arguments to create a User_settings.
     * @example
     * // Create one User_settings
     * const User_settings = await prisma.user_settings.create({
     *   data: {
     *     // ... data to create a User_settings
     *   }
     * })
     * 
     */
    create<T extends user_settingsCreateArgs>(args: SelectSubset<T, user_settingsCreateArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_settings.
     * @param {user_settingsCreateManyArgs} args - Arguments to create many User_settings.
     * @example
     * // Create many User_settings
     * const user_settings = await prisma.user_settings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_settingsCreateManyArgs>(args?: SelectSubset<T, user_settingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_settings and returns the data saved in the database.
     * @param {user_settingsCreateManyAndReturnArgs} args - Arguments to create many User_settings.
     * @example
     * // Create many User_settings
     * const user_settings = await prisma.user_settings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_settings and only return the `user_seq`
     * const user_settingsWithUser_seqOnly = await prisma.user_settings.createManyAndReturn({
     *   select: { user_seq: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_settingsCreateManyAndReturnArgs>(args?: SelectSubset<T, user_settingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User_settings.
     * @param {user_settingsDeleteArgs} args - Arguments to delete one User_settings.
     * @example
     * // Delete one User_settings
     * const User_settings = await prisma.user_settings.delete({
     *   where: {
     *     // ... filter to delete one User_settings
     *   }
     * })
     * 
     */
    delete<T extends user_settingsDeleteArgs>(args: SelectSubset<T, user_settingsDeleteArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_settings.
     * @param {user_settingsUpdateArgs} args - Arguments to update one User_settings.
     * @example
     * // Update one User_settings
     * const user_settings = await prisma.user_settings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_settingsUpdateArgs>(args: SelectSubset<T, user_settingsUpdateArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_settings.
     * @param {user_settingsDeleteManyArgs} args - Arguments to filter User_settings to delete.
     * @example
     * // Delete a few User_settings
     * const { count } = await prisma.user_settings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_settingsDeleteManyArgs>(args?: SelectSubset<T, user_settingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_settingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_settings
     * const user_settings = await prisma.user_settings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_settingsUpdateManyArgs>(args: SelectSubset<T, user_settingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_settings and returns the data updated in the database.
     * @param {user_settingsUpdateManyAndReturnArgs} args - Arguments to update many User_settings.
     * @example
     * // Update many User_settings
     * const user_settings = await prisma.user_settings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more User_settings and only return the `user_seq`
     * const user_settingsWithUser_seqOnly = await prisma.user_settings.updateManyAndReturn({
     *   select: { user_seq: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends user_settingsUpdateManyAndReturnArgs>(args: SelectSubset<T, user_settingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User_settings.
     * @param {user_settingsUpsertArgs} args - Arguments to update or create a User_settings.
     * @example
     * // Update or create a User_settings
     * const user_settings = await prisma.user_settings.upsert({
     *   create: {
     *     // ... data to create a User_settings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_settings we want to update
     *   }
     * })
     */
    upsert<T extends user_settingsUpsertArgs>(args: SelectSubset<T, user_settingsUpsertArgs<ExtArgs>>): Prisma__user_settingsClient<$Result.GetResult<Prisma.$user_settingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_settingsCountArgs} args - Arguments to filter User_settings to count.
     * @example
     * // Count the number of User_settings
     * const count = await prisma.user_settings.count({
     *   where: {
     *     // ... the filter for the User_settings we want to count
     *   }
     * })
    **/
    count<T extends user_settingsCountArgs>(
      args?: Subset<T, user_settingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_settingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_settingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_settingsAggregateArgs>(args: Subset<T, User_settingsAggregateArgs>): Prisma.PrismaPromise<GetUser_settingsAggregateType<T>>

    /**
     * Group by User_settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_settingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_settingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_settingsGroupByArgs['orderBy'] }
        : { orderBy?: user_settingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_settingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_settingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_settings model
   */
  readonly fields: user_settingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_settings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_settingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_settings model
   */
  interface user_settingsFieldRefs {
    readonly user_seq: FieldRef<"user_settings", 'BigInt'>
    readonly dark_mode: FieldRef<"user_settings", 'Boolean'>
    readonly notification_enabled: FieldRef<"user_settings", 'Boolean'>
    readonly compare_mode: FieldRef<"user_settings", 'String'>
    readonly currency_preference: FieldRef<"user_settings", 'String'>
    readonly updated_at: FieldRef<"user_settings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_settings findUnique
   */
  export type user_settingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * Filter, which user_settings to fetch.
     */
    where: user_settingsWhereUniqueInput
  }

  /**
   * user_settings findUniqueOrThrow
   */
  export type user_settingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * Filter, which user_settings to fetch.
     */
    where: user_settingsWhereUniqueInput
  }

  /**
   * user_settings findFirst
   */
  export type user_settingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * Filter, which user_settings to fetch.
     */
    where?: user_settingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_settings to fetch.
     */
    orderBy?: user_settingsOrderByWithRelationInput | user_settingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_settings.
     */
    cursor?: user_settingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_settings.
     */
    distinct?: User_settingsScalarFieldEnum | User_settingsScalarFieldEnum[]
  }

  /**
   * user_settings findFirstOrThrow
   */
  export type user_settingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * Filter, which user_settings to fetch.
     */
    where?: user_settingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_settings to fetch.
     */
    orderBy?: user_settingsOrderByWithRelationInput | user_settingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_settings.
     */
    cursor?: user_settingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_settings.
     */
    distinct?: User_settingsScalarFieldEnum | User_settingsScalarFieldEnum[]
  }

  /**
   * user_settings findMany
   */
  export type user_settingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * Filter, which user_settings to fetch.
     */
    where?: user_settingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_settings to fetch.
     */
    orderBy?: user_settingsOrderByWithRelationInput | user_settingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_settings.
     */
    cursor?: user_settingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_settings.
     */
    skip?: number
    distinct?: User_settingsScalarFieldEnum | User_settingsScalarFieldEnum[]
  }

  /**
   * user_settings create
   */
  export type user_settingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * The data needed to create a user_settings.
     */
    data: XOR<user_settingsCreateInput, user_settingsUncheckedCreateInput>
  }

  /**
   * user_settings createMany
   */
  export type user_settingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_settings.
     */
    data: user_settingsCreateManyInput | user_settingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_settings createManyAndReturn
   */
  export type user_settingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * The data used to create many user_settings.
     */
    data: user_settingsCreateManyInput | user_settingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_settings update
   */
  export type user_settingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * The data needed to update a user_settings.
     */
    data: XOR<user_settingsUpdateInput, user_settingsUncheckedUpdateInput>
    /**
     * Choose, which user_settings to update.
     */
    where: user_settingsWhereUniqueInput
  }

  /**
   * user_settings updateMany
   */
  export type user_settingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_settings.
     */
    data: XOR<user_settingsUpdateManyMutationInput, user_settingsUncheckedUpdateManyInput>
    /**
     * Filter which user_settings to update
     */
    where?: user_settingsWhereInput
    /**
     * Limit how many user_settings to update.
     */
    limit?: number
  }

  /**
   * user_settings updateManyAndReturn
   */
  export type user_settingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * The data used to update user_settings.
     */
    data: XOR<user_settingsUpdateManyMutationInput, user_settingsUncheckedUpdateManyInput>
    /**
     * Filter which user_settings to update
     */
    where?: user_settingsWhereInput
    /**
     * Limit how many user_settings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_settings upsert
   */
  export type user_settingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * The filter to search for the user_settings to update in case it exists.
     */
    where: user_settingsWhereUniqueInput
    /**
     * In case the user_settings found by the `where` argument doesn't exist, create a new user_settings with this data.
     */
    create: XOR<user_settingsCreateInput, user_settingsUncheckedCreateInput>
    /**
     * In case the user_settings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_settingsUpdateInput, user_settingsUncheckedUpdateInput>
  }

  /**
   * user_settings delete
   */
  export type user_settingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
    /**
     * Filter which user_settings to delete.
     */
    where: user_settingsWhereUniqueInput
  }

  /**
   * user_settings deleteMany
   */
  export type user_settingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_settings to delete
     */
    where?: user_settingsWhereInput
    /**
     * Limit how many user_settings to delete.
     */
    limit?: number
  }

  /**
   * user_settings without action
   */
  export type user_settingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_settings
     */
    select?: user_settingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_settings
     */
    omit?: user_settingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_settingsInclude<ExtArgs> | null
  }


  /**
   * Model payment_transactions
   */

  export type AggregatePayment_transactions = {
    _count: Payment_transactionsCountAggregateOutputType | null
    _avg: Payment_transactionsAvgAggregateOutputType | null
    _sum: Payment_transactionsSumAggregateOutputType | null
    _min: Payment_transactionsMinAggregateOutputType | null
    _max: Payment_transactionsMaxAggregateOutputType | null
  }

  export type Payment_transactionsAvgAggregateOutputType = {
    seq: number | null
    payment_method_seq: number | null
    amount: Decimal | null
    benefit_value: Decimal | null
  }

  export type Payment_transactionsSumAggregateOutputType = {
    seq: bigint | null
    payment_method_seq: bigint | null
    amount: Decimal | null
    benefit_value: Decimal | null
  }

  export type Payment_transactionsMinAggregateOutputType = {
    seq: bigint | null
    uuid: string | null
    user_uuid: string | null
    payment_method_seq: bigint | null
    merchant_name: string | null
    amount: Decimal | null
    currency: string | null
    benefit_value: Decimal | null
    benefit_desc: string | null
    compared_at: Date | null
    portone_payment_id: string | null
    portone_transaction_id: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Payment_transactionsMaxAggregateOutputType = {
    seq: bigint | null
    uuid: string | null
    user_uuid: string | null
    payment_method_seq: bigint | null
    merchant_name: string | null
    amount: Decimal | null
    currency: string | null
    benefit_value: Decimal | null
    benefit_desc: string | null
    compared_at: Date | null
    portone_payment_id: string | null
    portone_transaction_id: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Payment_transactionsCountAggregateOutputType = {
    seq: number
    uuid: number
    user_uuid: number
    payment_method_seq: number
    merchant_name: number
    amount: number
    currency: number
    benefit_value: number
    benefit_desc: number
    compared_at: number
    portone_payment_id: number
    portone_transaction_id: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Payment_transactionsAvgAggregateInputType = {
    seq?: true
    payment_method_seq?: true
    amount?: true
    benefit_value?: true
  }

  export type Payment_transactionsSumAggregateInputType = {
    seq?: true
    payment_method_seq?: true
    amount?: true
    benefit_value?: true
  }

  export type Payment_transactionsMinAggregateInputType = {
    seq?: true
    uuid?: true
    user_uuid?: true
    payment_method_seq?: true
    merchant_name?: true
    amount?: true
    currency?: true
    benefit_value?: true
    benefit_desc?: true
    compared_at?: true
    portone_payment_id?: true
    portone_transaction_id?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type Payment_transactionsMaxAggregateInputType = {
    seq?: true
    uuid?: true
    user_uuid?: true
    payment_method_seq?: true
    merchant_name?: true
    amount?: true
    currency?: true
    benefit_value?: true
    benefit_desc?: true
    compared_at?: true
    portone_payment_id?: true
    portone_transaction_id?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type Payment_transactionsCountAggregateInputType = {
    seq?: true
    uuid?: true
    user_uuid?: true
    payment_method_seq?: true
    merchant_name?: true
    amount?: true
    currency?: true
    benefit_value?: true
    benefit_desc?: true
    compared_at?: true
    portone_payment_id?: true
    portone_transaction_id?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Payment_transactionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which payment_transactions to aggregate.
     */
    where?: payment_transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_transactions to fetch.
     */
    orderBy?: payment_transactionsOrderByWithRelationInput | payment_transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: payment_transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned payment_transactions
    **/
    _count?: true | Payment_transactionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Payment_transactionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Payment_transactionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Payment_transactionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Payment_transactionsMaxAggregateInputType
  }

  export type GetPayment_transactionsAggregateType<T extends Payment_transactionsAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment_transactions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment_transactions[P]>
      : GetScalarType<T[P], AggregatePayment_transactions[P]>
  }




  export type payment_transactionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: payment_transactionsWhereInput
    orderBy?: payment_transactionsOrderByWithAggregationInput | payment_transactionsOrderByWithAggregationInput[]
    by: Payment_transactionsScalarFieldEnum[] | Payment_transactionsScalarFieldEnum
    having?: payment_transactionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Payment_transactionsCountAggregateInputType | true
    _avg?: Payment_transactionsAvgAggregateInputType
    _sum?: Payment_transactionsSumAggregateInputType
    _min?: Payment_transactionsMinAggregateInputType
    _max?: Payment_transactionsMaxAggregateInputType
  }

  export type Payment_transactionsGroupByOutputType = {
    seq: bigint
    uuid: string
    user_uuid: string
    payment_method_seq: bigint | null
    merchant_name: string
    amount: Decimal
    currency: string
    benefit_value: Decimal | null
    benefit_desc: string | null
    compared_at: Date | null
    portone_payment_id: string | null
    portone_transaction_id: string | null
    status: string
    created_at: Date
    updated_at: Date
    _count: Payment_transactionsCountAggregateOutputType | null
    _avg: Payment_transactionsAvgAggregateOutputType | null
    _sum: Payment_transactionsSumAggregateOutputType | null
    _min: Payment_transactionsMinAggregateOutputType | null
    _max: Payment_transactionsMaxAggregateOutputType | null
  }

  type GetPayment_transactionsGroupByPayload<T extends payment_transactionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Payment_transactionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Payment_transactionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Payment_transactionsGroupByOutputType[P]>
            : GetScalarType<T[P], Payment_transactionsGroupByOutputType[P]>
        }
      >
    >


  export type payment_transactionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    payment_method_seq?: boolean
    merchant_name?: boolean
    amount?: boolean
    currency?: boolean
    benefit_value?: boolean
    benefit_desc?: boolean
    compared_at?: boolean
    portone_payment_id?: boolean
    portone_transaction_id?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment_transactions"]>

  export type payment_transactionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    payment_method_seq?: boolean
    merchant_name?: boolean
    amount?: boolean
    currency?: boolean
    benefit_value?: boolean
    benefit_desc?: boolean
    compared_at?: boolean
    portone_payment_id?: boolean
    portone_transaction_id?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment_transactions"]>

  export type payment_transactionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    payment_method_seq?: boolean
    merchant_name?: boolean
    amount?: boolean
    currency?: boolean
    benefit_value?: boolean
    benefit_desc?: boolean
    compared_at?: boolean
    portone_payment_id?: boolean
    portone_transaction_id?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment_transactions"]>

  export type payment_transactionsSelectScalar = {
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    payment_method_seq?: boolean
    merchant_name?: boolean
    amount?: boolean
    currency?: boolean
    benefit_value?: boolean
    benefit_desc?: boolean
    compared_at?: boolean
    portone_payment_id?: boolean
    portone_transaction_id?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type payment_transactionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"seq" | "uuid" | "user_uuid" | "payment_method_seq" | "merchant_name" | "amount" | "currency" | "benefit_value" | "benefit_desc" | "compared_at" | "portone_payment_id" | "portone_transaction_id" | "status" | "created_at" | "updated_at", ExtArgs["result"]["payment_transactions"]>
  export type payment_transactionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type payment_transactionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type payment_transactionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $payment_transactionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "payment_transactions"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      seq: bigint
      uuid: string
      user_uuid: string
      payment_method_seq: bigint | null
      merchant_name: string
      amount: Prisma.Decimal
      currency: string
      benefit_value: Prisma.Decimal | null
      benefit_desc: string | null
      compared_at: Date | null
      portone_payment_id: string | null
      portone_transaction_id: string | null
      status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["payment_transactions"]>
    composites: {}
  }

  type payment_transactionsGetPayload<S extends boolean | null | undefined | payment_transactionsDefaultArgs> = $Result.GetResult<Prisma.$payment_transactionsPayload, S>

  type payment_transactionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<payment_transactionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Payment_transactionsCountAggregateInputType | true
    }

  export interface payment_transactionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['payment_transactions'], meta: { name: 'payment_transactions' } }
    /**
     * Find zero or one Payment_transactions that matches the filter.
     * @param {payment_transactionsFindUniqueArgs} args - Arguments to find a Payment_transactions
     * @example
     * // Get one Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends payment_transactionsFindUniqueArgs>(args: SelectSubset<T, payment_transactionsFindUniqueArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment_transactions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {payment_transactionsFindUniqueOrThrowArgs} args - Arguments to find a Payment_transactions
     * @example
     * // Get one Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends payment_transactionsFindUniqueOrThrowArgs>(args: SelectSubset<T, payment_transactionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment_transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_transactionsFindFirstArgs} args - Arguments to find a Payment_transactions
     * @example
     * // Get one Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends payment_transactionsFindFirstArgs>(args?: SelectSubset<T, payment_transactionsFindFirstArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment_transactions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_transactionsFindFirstOrThrowArgs} args - Arguments to find a Payment_transactions
     * @example
     * // Get one Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends payment_transactionsFindFirstOrThrowArgs>(args?: SelectSubset<T, payment_transactionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payment_transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_transactionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.findMany()
     * 
     * // Get first 10 Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.findMany({ take: 10 })
     * 
     * // Only select the `seq`
     * const payment_transactionsWithSeqOnly = await prisma.payment_transactions.findMany({ select: { seq: true } })
     * 
     */
    findMany<T extends payment_transactionsFindManyArgs>(args?: SelectSubset<T, payment_transactionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment_transactions.
     * @param {payment_transactionsCreateArgs} args - Arguments to create a Payment_transactions.
     * @example
     * // Create one Payment_transactions
     * const Payment_transactions = await prisma.payment_transactions.create({
     *   data: {
     *     // ... data to create a Payment_transactions
     *   }
     * })
     * 
     */
    create<T extends payment_transactionsCreateArgs>(args: SelectSubset<T, payment_transactionsCreateArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payment_transactions.
     * @param {payment_transactionsCreateManyArgs} args - Arguments to create many Payment_transactions.
     * @example
     * // Create many Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends payment_transactionsCreateManyArgs>(args?: SelectSubset<T, payment_transactionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payment_transactions and returns the data saved in the database.
     * @param {payment_transactionsCreateManyAndReturnArgs} args - Arguments to create many Payment_transactions.
     * @example
     * // Create many Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payment_transactions and only return the `seq`
     * const payment_transactionsWithSeqOnly = await prisma.payment_transactions.createManyAndReturn({
     *   select: { seq: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends payment_transactionsCreateManyAndReturnArgs>(args?: SelectSubset<T, payment_transactionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment_transactions.
     * @param {payment_transactionsDeleteArgs} args - Arguments to delete one Payment_transactions.
     * @example
     * // Delete one Payment_transactions
     * const Payment_transactions = await prisma.payment_transactions.delete({
     *   where: {
     *     // ... filter to delete one Payment_transactions
     *   }
     * })
     * 
     */
    delete<T extends payment_transactionsDeleteArgs>(args: SelectSubset<T, payment_transactionsDeleteArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment_transactions.
     * @param {payment_transactionsUpdateArgs} args - Arguments to update one Payment_transactions.
     * @example
     * // Update one Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends payment_transactionsUpdateArgs>(args: SelectSubset<T, payment_transactionsUpdateArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payment_transactions.
     * @param {payment_transactionsDeleteManyArgs} args - Arguments to filter Payment_transactions to delete.
     * @example
     * // Delete a few Payment_transactions
     * const { count } = await prisma.payment_transactions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends payment_transactionsDeleteManyArgs>(args?: SelectSubset<T, payment_transactionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payment_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_transactionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends payment_transactionsUpdateManyArgs>(args: SelectSubset<T, payment_transactionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payment_transactions and returns the data updated in the database.
     * @param {payment_transactionsUpdateManyAndReturnArgs} args - Arguments to update many Payment_transactions.
     * @example
     * // Update many Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payment_transactions and only return the `seq`
     * const payment_transactionsWithSeqOnly = await prisma.payment_transactions.updateManyAndReturn({
     *   select: { seq: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends payment_transactionsUpdateManyAndReturnArgs>(args: SelectSubset<T, payment_transactionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment_transactions.
     * @param {payment_transactionsUpsertArgs} args - Arguments to update or create a Payment_transactions.
     * @example
     * // Update or create a Payment_transactions
     * const payment_transactions = await prisma.payment_transactions.upsert({
     *   create: {
     *     // ... data to create a Payment_transactions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment_transactions we want to update
     *   }
     * })
     */
    upsert<T extends payment_transactionsUpsertArgs>(args: SelectSubset<T, payment_transactionsUpsertArgs<ExtArgs>>): Prisma__payment_transactionsClient<$Result.GetResult<Prisma.$payment_transactionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payment_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_transactionsCountArgs} args - Arguments to filter Payment_transactions to count.
     * @example
     * // Count the number of Payment_transactions
     * const count = await prisma.payment_transactions.count({
     *   where: {
     *     // ... the filter for the Payment_transactions we want to count
     *   }
     * })
    **/
    count<T extends payment_transactionsCountArgs>(
      args?: Subset<T, payment_transactionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Payment_transactionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Payment_transactionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Payment_transactionsAggregateArgs>(args: Subset<T, Payment_transactionsAggregateArgs>): Prisma.PrismaPromise<GetPayment_transactionsAggregateType<T>>

    /**
     * Group by Payment_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {payment_transactionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends payment_transactionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: payment_transactionsGroupByArgs['orderBy'] }
        : { orderBy?: payment_transactionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, payment_transactionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayment_transactionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the payment_transactions model
   */
  readonly fields: payment_transactionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for payment_transactions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__payment_transactionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the payment_transactions model
   */
  interface payment_transactionsFieldRefs {
    readonly seq: FieldRef<"payment_transactions", 'BigInt'>
    readonly uuid: FieldRef<"payment_transactions", 'String'>
    readonly user_uuid: FieldRef<"payment_transactions", 'String'>
    readonly payment_method_seq: FieldRef<"payment_transactions", 'BigInt'>
    readonly merchant_name: FieldRef<"payment_transactions", 'String'>
    readonly amount: FieldRef<"payment_transactions", 'Decimal'>
    readonly currency: FieldRef<"payment_transactions", 'String'>
    readonly benefit_value: FieldRef<"payment_transactions", 'Decimal'>
    readonly benefit_desc: FieldRef<"payment_transactions", 'String'>
    readonly compared_at: FieldRef<"payment_transactions", 'DateTime'>
    readonly portone_payment_id: FieldRef<"payment_transactions", 'String'>
    readonly portone_transaction_id: FieldRef<"payment_transactions", 'String'>
    readonly status: FieldRef<"payment_transactions", 'String'>
    readonly created_at: FieldRef<"payment_transactions", 'DateTime'>
    readonly updated_at: FieldRef<"payment_transactions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * payment_transactions findUnique
   */
  export type payment_transactionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * Filter, which payment_transactions to fetch.
     */
    where: payment_transactionsWhereUniqueInput
  }

  /**
   * payment_transactions findUniqueOrThrow
   */
  export type payment_transactionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * Filter, which payment_transactions to fetch.
     */
    where: payment_transactionsWhereUniqueInput
  }

  /**
   * payment_transactions findFirst
   */
  export type payment_transactionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * Filter, which payment_transactions to fetch.
     */
    where?: payment_transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_transactions to fetch.
     */
    orderBy?: payment_transactionsOrderByWithRelationInput | payment_transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for payment_transactions.
     */
    cursor?: payment_transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of payment_transactions.
     */
    distinct?: Payment_transactionsScalarFieldEnum | Payment_transactionsScalarFieldEnum[]
  }

  /**
   * payment_transactions findFirstOrThrow
   */
  export type payment_transactionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * Filter, which payment_transactions to fetch.
     */
    where?: payment_transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_transactions to fetch.
     */
    orderBy?: payment_transactionsOrderByWithRelationInput | payment_transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for payment_transactions.
     */
    cursor?: payment_transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of payment_transactions.
     */
    distinct?: Payment_transactionsScalarFieldEnum | Payment_transactionsScalarFieldEnum[]
  }

  /**
   * payment_transactions findMany
   */
  export type payment_transactionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * Filter, which payment_transactions to fetch.
     */
    where?: payment_transactionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of payment_transactions to fetch.
     */
    orderBy?: payment_transactionsOrderByWithRelationInput | payment_transactionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing payment_transactions.
     */
    cursor?: payment_transactionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` payment_transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` payment_transactions.
     */
    skip?: number
    distinct?: Payment_transactionsScalarFieldEnum | Payment_transactionsScalarFieldEnum[]
  }

  /**
   * payment_transactions create
   */
  export type payment_transactionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * The data needed to create a payment_transactions.
     */
    data: XOR<payment_transactionsCreateInput, payment_transactionsUncheckedCreateInput>
  }

  /**
   * payment_transactions createMany
   */
  export type payment_transactionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many payment_transactions.
     */
    data: payment_transactionsCreateManyInput | payment_transactionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * payment_transactions createManyAndReturn
   */
  export type payment_transactionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * The data used to create many payment_transactions.
     */
    data: payment_transactionsCreateManyInput | payment_transactionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * payment_transactions update
   */
  export type payment_transactionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * The data needed to update a payment_transactions.
     */
    data: XOR<payment_transactionsUpdateInput, payment_transactionsUncheckedUpdateInput>
    /**
     * Choose, which payment_transactions to update.
     */
    where: payment_transactionsWhereUniqueInput
  }

  /**
   * payment_transactions updateMany
   */
  export type payment_transactionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update payment_transactions.
     */
    data: XOR<payment_transactionsUpdateManyMutationInput, payment_transactionsUncheckedUpdateManyInput>
    /**
     * Filter which payment_transactions to update
     */
    where?: payment_transactionsWhereInput
    /**
     * Limit how many payment_transactions to update.
     */
    limit?: number
  }

  /**
   * payment_transactions updateManyAndReturn
   */
  export type payment_transactionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * The data used to update payment_transactions.
     */
    data: XOR<payment_transactionsUpdateManyMutationInput, payment_transactionsUncheckedUpdateManyInput>
    /**
     * Filter which payment_transactions to update
     */
    where?: payment_transactionsWhereInput
    /**
     * Limit how many payment_transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * payment_transactions upsert
   */
  export type payment_transactionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * The filter to search for the payment_transactions to update in case it exists.
     */
    where: payment_transactionsWhereUniqueInput
    /**
     * In case the payment_transactions found by the `where` argument doesn't exist, create a new payment_transactions with this data.
     */
    create: XOR<payment_transactionsCreateInput, payment_transactionsUncheckedCreateInput>
    /**
     * In case the payment_transactions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<payment_transactionsUpdateInput, payment_transactionsUncheckedUpdateInput>
  }

  /**
   * payment_transactions delete
   */
  export type payment_transactionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
    /**
     * Filter which payment_transactions to delete.
     */
    where: payment_transactionsWhereUniqueInput
  }

  /**
   * payment_transactions deleteMany
   */
  export type payment_transactionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which payment_transactions to delete
     */
    where?: payment_transactionsWhereInput
    /**
     * Limit how many payment_transactions to delete.
     */
    limit?: number
  }

  /**
   * payment_transactions without action
   */
  export type payment_transactionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the payment_transactions
     */
    select?: payment_transactionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the payment_transactions
     */
    omit?: payment_transactionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: payment_transactionsInclude<ExtArgs> | null
  }


  /**
   * Model identity_verifications
   */

  export type AggregateIdentity_verifications = {
    _count: Identity_verificationsCountAggregateOutputType | null
    _avg: Identity_verificationsAvgAggregateOutputType | null
    _sum: Identity_verificationsSumAggregateOutputType | null
    _min: Identity_verificationsMinAggregateOutputType | null
    _max: Identity_verificationsMaxAggregateOutputType | null
  }

  export type Identity_verificationsAvgAggregateOutputType = {
    seq: number | null
  }

  export type Identity_verificationsSumAggregateOutputType = {
    seq: bigint | null
  }

  export type Identity_verificationsMinAggregateOutputType = {
    seq: bigint | null
    uuid: string | null
    user_uuid: string | null
    portone_id: string | null
    channel_key: string | null
    operator: string | null
    method: string | null
    status: string | null
    customer_name: string | null
    customer_phone: string | null
    customer_email: string | null
    ci: string | null
    di: string | null
    custom_data: string | null
    requested_at: Date | null
    status_changed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Identity_verificationsMaxAggregateOutputType = {
    seq: bigint | null
    uuid: string | null
    user_uuid: string | null
    portone_id: string | null
    channel_key: string | null
    operator: string | null
    method: string | null
    status: string | null
    customer_name: string | null
    customer_phone: string | null
    customer_email: string | null
    ci: string | null
    di: string | null
    custom_data: string | null
    requested_at: Date | null
    status_changed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Identity_verificationsCountAggregateOutputType = {
    seq: number
    uuid: number
    user_uuid: number
    portone_id: number
    channel_key: number
    operator: number
    method: number
    status: number
    customer_name: number
    customer_phone: number
    customer_email: number
    ci: number
    di: number
    custom_data: number
    requested_at: number
    status_changed_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Identity_verificationsAvgAggregateInputType = {
    seq?: true
  }

  export type Identity_verificationsSumAggregateInputType = {
    seq?: true
  }

  export type Identity_verificationsMinAggregateInputType = {
    seq?: true
    uuid?: true
    user_uuid?: true
    portone_id?: true
    channel_key?: true
    operator?: true
    method?: true
    status?: true
    customer_name?: true
    customer_phone?: true
    customer_email?: true
    ci?: true
    di?: true
    custom_data?: true
    requested_at?: true
    status_changed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type Identity_verificationsMaxAggregateInputType = {
    seq?: true
    uuid?: true
    user_uuid?: true
    portone_id?: true
    channel_key?: true
    operator?: true
    method?: true
    status?: true
    customer_name?: true
    customer_phone?: true
    customer_email?: true
    ci?: true
    di?: true
    custom_data?: true
    requested_at?: true
    status_changed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type Identity_verificationsCountAggregateInputType = {
    seq?: true
    uuid?: true
    user_uuid?: true
    portone_id?: true
    channel_key?: true
    operator?: true
    method?: true
    status?: true
    customer_name?: true
    customer_phone?: true
    customer_email?: true
    ci?: true
    di?: true
    custom_data?: true
    requested_at?: true
    status_changed_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Identity_verificationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which identity_verifications to aggregate.
     */
    where?: identity_verificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of identity_verifications to fetch.
     */
    orderBy?: identity_verificationsOrderByWithRelationInput | identity_verificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: identity_verificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` identity_verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` identity_verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned identity_verifications
    **/
    _count?: true | Identity_verificationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Identity_verificationsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Identity_verificationsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Identity_verificationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Identity_verificationsMaxAggregateInputType
  }

  export type GetIdentity_verificationsAggregateType<T extends Identity_verificationsAggregateArgs> = {
        [P in keyof T & keyof AggregateIdentity_verifications]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdentity_verifications[P]>
      : GetScalarType<T[P], AggregateIdentity_verifications[P]>
  }




  export type identity_verificationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: identity_verificationsWhereInput
    orderBy?: identity_verificationsOrderByWithAggregationInput | identity_verificationsOrderByWithAggregationInput[]
    by: Identity_verificationsScalarFieldEnum[] | Identity_verificationsScalarFieldEnum
    having?: identity_verificationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Identity_verificationsCountAggregateInputType | true
    _avg?: Identity_verificationsAvgAggregateInputType
    _sum?: Identity_verificationsSumAggregateInputType
    _min?: Identity_verificationsMinAggregateInputType
    _max?: Identity_verificationsMaxAggregateInputType
  }

  export type Identity_verificationsGroupByOutputType = {
    seq: bigint
    uuid: string
    user_uuid: string
    portone_id: string
    channel_key: string
    operator: string
    method: string
    status: string
    customer_name: string | null
    customer_phone: string | null
    customer_email: string | null
    ci: string | null
    di: string | null
    custom_data: string | null
    requested_at: Date
    status_changed_at: Date
    created_at: Date
    updated_at: Date
    _count: Identity_verificationsCountAggregateOutputType | null
    _avg: Identity_verificationsAvgAggregateOutputType | null
    _sum: Identity_verificationsSumAggregateOutputType | null
    _min: Identity_verificationsMinAggregateOutputType | null
    _max: Identity_verificationsMaxAggregateOutputType | null
  }

  type GetIdentity_verificationsGroupByPayload<T extends identity_verificationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Identity_verificationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Identity_verificationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Identity_verificationsGroupByOutputType[P]>
            : GetScalarType<T[P], Identity_verificationsGroupByOutputType[P]>
        }
      >
    >


  export type identity_verificationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    portone_id?: boolean
    channel_key?: boolean
    operator?: boolean
    method?: boolean
    status?: boolean
    customer_name?: boolean
    customer_phone?: boolean
    customer_email?: boolean
    ci?: boolean
    di?: boolean
    custom_data?: boolean
    requested_at?: boolean
    status_changed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["identity_verifications"]>

  export type identity_verificationsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    portone_id?: boolean
    channel_key?: boolean
    operator?: boolean
    method?: boolean
    status?: boolean
    customer_name?: boolean
    customer_phone?: boolean
    customer_email?: boolean
    ci?: boolean
    di?: boolean
    custom_data?: boolean
    requested_at?: boolean
    status_changed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["identity_verifications"]>

  export type identity_verificationsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    portone_id?: boolean
    channel_key?: boolean
    operator?: boolean
    method?: boolean
    status?: boolean
    customer_name?: boolean
    customer_phone?: boolean
    customer_email?: boolean
    ci?: boolean
    di?: boolean
    custom_data?: boolean
    requested_at?: boolean
    status_changed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["identity_verifications"]>

  export type identity_verificationsSelectScalar = {
    seq?: boolean
    uuid?: boolean
    user_uuid?: boolean
    portone_id?: boolean
    channel_key?: boolean
    operator?: boolean
    method?: boolean
    status?: boolean
    customer_name?: boolean
    customer_phone?: boolean
    customer_email?: boolean
    ci?: boolean
    di?: boolean
    custom_data?: boolean
    requested_at?: boolean
    status_changed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type identity_verificationsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"seq" | "uuid" | "user_uuid" | "portone_id" | "channel_key" | "operator" | "method" | "status" | "customer_name" | "customer_phone" | "customer_email" | "ci" | "di" | "custom_data" | "requested_at" | "status_changed_at" | "created_at" | "updated_at", ExtArgs["result"]["identity_verifications"]>
  export type identity_verificationsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type identity_verificationsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type identity_verificationsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $identity_verificationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "identity_verifications"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      seq: bigint
      uuid: string
      user_uuid: string
      portone_id: string
      channel_key: string
      operator: string
      method: string
      status: string
      customer_name: string | null
      customer_phone: string | null
      customer_email: string | null
      ci: string | null
      di: string | null
      custom_data: string | null
      requested_at: Date
      status_changed_at: Date
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["identity_verifications"]>
    composites: {}
  }

  type identity_verificationsGetPayload<S extends boolean | null | undefined | identity_verificationsDefaultArgs> = $Result.GetResult<Prisma.$identity_verificationsPayload, S>

  type identity_verificationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<identity_verificationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Identity_verificationsCountAggregateInputType | true
    }

  export interface identity_verificationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['identity_verifications'], meta: { name: 'identity_verifications' } }
    /**
     * Find zero or one Identity_verifications that matches the filter.
     * @param {identity_verificationsFindUniqueArgs} args - Arguments to find a Identity_verifications
     * @example
     * // Get one Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends identity_verificationsFindUniqueArgs>(args: SelectSubset<T, identity_verificationsFindUniqueArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Identity_verifications that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {identity_verificationsFindUniqueOrThrowArgs} args - Arguments to find a Identity_verifications
     * @example
     * // Get one Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends identity_verificationsFindUniqueOrThrowArgs>(args: SelectSubset<T, identity_verificationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Identity_verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {identity_verificationsFindFirstArgs} args - Arguments to find a Identity_verifications
     * @example
     * // Get one Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends identity_verificationsFindFirstArgs>(args?: SelectSubset<T, identity_verificationsFindFirstArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Identity_verifications that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {identity_verificationsFindFirstOrThrowArgs} args - Arguments to find a Identity_verifications
     * @example
     * // Get one Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends identity_verificationsFindFirstOrThrowArgs>(args?: SelectSubset<T, identity_verificationsFindFirstOrThrowArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Identity_verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {identity_verificationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.findMany()
     * 
     * // Get first 10 Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.findMany({ take: 10 })
     * 
     * // Only select the `seq`
     * const identity_verificationsWithSeqOnly = await prisma.identity_verifications.findMany({ select: { seq: true } })
     * 
     */
    findMany<T extends identity_verificationsFindManyArgs>(args?: SelectSubset<T, identity_verificationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Identity_verifications.
     * @param {identity_verificationsCreateArgs} args - Arguments to create a Identity_verifications.
     * @example
     * // Create one Identity_verifications
     * const Identity_verifications = await prisma.identity_verifications.create({
     *   data: {
     *     // ... data to create a Identity_verifications
     *   }
     * })
     * 
     */
    create<T extends identity_verificationsCreateArgs>(args: SelectSubset<T, identity_verificationsCreateArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Identity_verifications.
     * @param {identity_verificationsCreateManyArgs} args - Arguments to create many Identity_verifications.
     * @example
     * // Create many Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends identity_verificationsCreateManyArgs>(args?: SelectSubset<T, identity_verificationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Identity_verifications and returns the data saved in the database.
     * @param {identity_verificationsCreateManyAndReturnArgs} args - Arguments to create many Identity_verifications.
     * @example
     * // Create many Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Identity_verifications and only return the `seq`
     * const identity_verificationsWithSeqOnly = await prisma.identity_verifications.createManyAndReturn({
     *   select: { seq: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends identity_verificationsCreateManyAndReturnArgs>(args?: SelectSubset<T, identity_verificationsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Identity_verifications.
     * @param {identity_verificationsDeleteArgs} args - Arguments to delete one Identity_verifications.
     * @example
     * // Delete one Identity_verifications
     * const Identity_verifications = await prisma.identity_verifications.delete({
     *   where: {
     *     // ... filter to delete one Identity_verifications
     *   }
     * })
     * 
     */
    delete<T extends identity_verificationsDeleteArgs>(args: SelectSubset<T, identity_verificationsDeleteArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Identity_verifications.
     * @param {identity_verificationsUpdateArgs} args - Arguments to update one Identity_verifications.
     * @example
     * // Update one Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends identity_verificationsUpdateArgs>(args: SelectSubset<T, identity_verificationsUpdateArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Identity_verifications.
     * @param {identity_verificationsDeleteManyArgs} args - Arguments to filter Identity_verifications to delete.
     * @example
     * // Delete a few Identity_verifications
     * const { count } = await prisma.identity_verifications.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends identity_verificationsDeleteManyArgs>(args?: SelectSubset<T, identity_verificationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Identity_verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {identity_verificationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends identity_verificationsUpdateManyArgs>(args: SelectSubset<T, identity_verificationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Identity_verifications and returns the data updated in the database.
     * @param {identity_verificationsUpdateManyAndReturnArgs} args - Arguments to update many Identity_verifications.
     * @example
     * // Update many Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Identity_verifications and only return the `seq`
     * const identity_verificationsWithSeqOnly = await prisma.identity_verifications.updateManyAndReturn({
     *   select: { seq: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends identity_verificationsUpdateManyAndReturnArgs>(args: SelectSubset<T, identity_verificationsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Identity_verifications.
     * @param {identity_verificationsUpsertArgs} args - Arguments to update or create a Identity_verifications.
     * @example
     * // Update or create a Identity_verifications
     * const identity_verifications = await prisma.identity_verifications.upsert({
     *   create: {
     *     // ... data to create a Identity_verifications
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Identity_verifications we want to update
     *   }
     * })
     */
    upsert<T extends identity_verificationsUpsertArgs>(args: SelectSubset<T, identity_verificationsUpsertArgs<ExtArgs>>): Prisma__identity_verificationsClient<$Result.GetResult<Prisma.$identity_verificationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Identity_verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {identity_verificationsCountArgs} args - Arguments to filter Identity_verifications to count.
     * @example
     * // Count the number of Identity_verifications
     * const count = await prisma.identity_verifications.count({
     *   where: {
     *     // ... the filter for the Identity_verifications we want to count
     *   }
     * })
    **/
    count<T extends identity_verificationsCountArgs>(
      args?: Subset<T, identity_verificationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Identity_verificationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Identity_verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Identity_verificationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Identity_verificationsAggregateArgs>(args: Subset<T, Identity_verificationsAggregateArgs>): Prisma.PrismaPromise<GetIdentity_verificationsAggregateType<T>>

    /**
     * Group by Identity_verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {identity_verificationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends identity_verificationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: identity_verificationsGroupByArgs['orderBy'] }
        : { orderBy?: identity_verificationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, identity_verificationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdentity_verificationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the identity_verifications model
   */
  readonly fields: identity_verificationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for identity_verifications.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__identity_verificationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the identity_verifications model
   */
  interface identity_verificationsFieldRefs {
    readonly seq: FieldRef<"identity_verifications", 'BigInt'>
    readonly uuid: FieldRef<"identity_verifications", 'String'>
    readonly user_uuid: FieldRef<"identity_verifications", 'String'>
    readonly portone_id: FieldRef<"identity_verifications", 'String'>
    readonly channel_key: FieldRef<"identity_verifications", 'String'>
    readonly operator: FieldRef<"identity_verifications", 'String'>
    readonly method: FieldRef<"identity_verifications", 'String'>
    readonly status: FieldRef<"identity_verifications", 'String'>
    readonly customer_name: FieldRef<"identity_verifications", 'String'>
    readonly customer_phone: FieldRef<"identity_verifications", 'String'>
    readonly customer_email: FieldRef<"identity_verifications", 'String'>
    readonly ci: FieldRef<"identity_verifications", 'String'>
    readonly di: FieldRef<"identity_verifications", 'String'>
    readonly custom_data: FieldRef<"identity_verifications", 'String'>
    readonly requested_at: FieldRef<"identity_verifications", 'DateTime'>
    readonly status_changed_at: FieldRef<"identity_verifications", 'DateTime'>
    readonly created_at: FieldRef<"identity_verifications", 'DateTime'>
    readonly updated_at: FieldRef<"identity_verifications", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * identity_verifications findUnique
   */
  export type identity_verificationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * Filter, which identity_verifications to fetch.
     */
    where: identity_verificationsWhereUniqueInput
  }

  /**
   * identity_verifications findUniqueOrThrow
   */
  export type identity_verificationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * Filter, which identity_verifications to fetch.
     */
    where: identity_verificationsWhereUniqueInput
  }

  /**
   * identity_verifications findFirst
   */
  export type identity_verificationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * Filter, which identity_verifications to fetch.
     */
    where?: identity_verificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of identity_verifications to fetch.
     */
    orderBy?: identity_verificationsOrderByWithRelationInput | identity_verificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for identity_verifications.
     */
    cursor?: identity_verificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` identity_verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` identity_verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of identity_verifications.
     */
    distinct?: Identity_verificationsScalarFieldEnum | Identity_verificationsScalarFieldEnum[]
  }

  /**
   * identity_verifications findFirstOrThrow
   */
  export type identity_verificationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * Filter, which identity_verifications to fetch.
     */
    where?: identity_verificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of identity_verifications to fetch.
     */
    orderBy?: identity_verificationsOrderByWithRelationInput | identity_verificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for identity_verifications.
     */
    cursor?: identity_verificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` identity_verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` identity_verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of identity_verifications.
     */
    distinct?: Identity_verificationsScalarFieldEnum | Identity_verificationsScalarFieldEnum[]
  }

  /**
   * identity_verifications findMany
   */
  export type identity_verificationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * Filter, which identity_verifications to fetch.
     */
    where?: identity_verificationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of identity_verifications to fetch.
     */
    orderBy?: identity_verificationsOrderByWithRelationInput | identity_verificationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing identity_verifications.
     */
    cursor?: identity_verificationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` identity_verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` identity_verifications.
     */
    skip?: number
    distinct?: Identity_verificationsScalarFieldEnum | Identity_verificationsScalarFieldEnum[]
  }

  /**
   * identity_verifications create
   */
  export type identity_verificationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * The data needed to create a identity_verifications.
     */
    data: XOR<identity_verificationsCreateInput, identity_verificationsUncheckedCreateInput>
  }

  /**
   * identity_verifications createMany
   */
  export type identity_verificationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many identity_verifications.
     */
    data: identity_verificationsCreateManyInput | identity_verificationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * identity_verifications createManyAndReturn
   */
  export type identity_verificationsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * The data used to create many identity_verifications.
     */
    data: identity_verificationsCreateManyInput | identity_verificationsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * identity_verifications update
   */
  export type identity_verificationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * The data needed to update a identity_verifications.
     */
    data: XOR<identity_verificationsUpdateInput, identity_verificationsUncheckedUpdateInput>
    /**
     * Choose, which identity_verifications to update.
     */
    where: identity_verificationsWhereUniqueInput
  }

  /**
   * identity_verifications updateMany
   */
  export type identity_verificationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update identity_verifications.
     */
    data: XOR<identity_verificationsUpdateManyMutationInput, identity_verificationsUncheckedUpdateManyInput>
    /**
     * Filter which identity_verifications to update
     */
    where?: identity_verificationsWhereInput
    /**
     * Limit how many identity_verifications to update.
     */
    limit?: number
  }

  /**
   * identity_verifications updateManyAndReturn
   */
  export type identity_verificationsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * The data used to update identity_verifications.
     */
    data: XOR<identity_verificationsUpdateManyMutationInput, identity_verificationsUncheckedUpdateManyInput>
    /**
     * Filter which identity_verifications to update
     */
    where?: identity_verificationsWhereInput
    /**
     * Limit how many identity_verifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * identity_verifications upsert
   */
  export type identity_verificationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * The filter to search for the identity_verifications to update in case it exists.
     */
    where: identity_verificationsWhereUniqueInput
    /**
     * In case the identity_verifications found by the `where` argument doesn't exist, create a new identity_verifications with this data.
     */
    create: XOR<identity_verificationsCreateInput, identity_verificationsUncheckedCreateInput>
    /**
     * In case the identity_verifications was found with the provided `where` argument, update it with this data.
     */
    update: XOR<identity_verificationsUpdateInput, identity_verificationsUncheckedUpdateInput>
  }

  /**
   * identity_verifications delete
   */
  export type identity_verificationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
    /**
     * Filter which identity_verifications to delete.
     */
    where: identity_verificationsWhereUniqueInput
  }

  /**
   * identity_verifications deleteMany
   */
  export type identity_verificationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which identity_verifications to delete
     */
    where?: identity_verificationsWhereInput
    /**
     * Limit how many identity_verifications to delete.
     */
    limit?: number
  }

  /**
   * identity_verifications without action
   */
  export type identity_verificationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the identity_verifications
     */
    select?: identity_verificationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the identity_verifications
     */
    omit?: identity_verificationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: identity_verificationsInclude<ExtArgs> | null
  }


  /**
   * Model benefit_offers
   */

  export type AggregateBenefit_offers = {
    _count: Benefit_offersCountAggregateOutputType | null
    _avg: Benefit_offersAvgAggregateOutputType | null
    _sum: Benefit_offersSumAggregateOutputType | null
    _min: Benefit_offersMinAggregateOutputType | null
    _max: Benefit_offersMaxAggregateOutputType | null
  }

  export type Benefit_offersAvgAggregateOutputType = {
    id: number | null
    min_spend: Decimal | null
    discount_value: Decimal | null
    max_discount: Decimal | null
  }

  export type Benefit_offersSumAggregateOutputType = {
    id: bigint | null
    min_spend: Decimal | null
    discount_value: Decimal | null
    max_discount: Decimal | null
  }

  export type Benefit_offersMinAggregateOutputType = {
    id: bigint | null
    provider_name: string | null
    payment_type: $Enums.PaymentType | null
    title: string | null
    description: string | null
    merchant_filter: string | null
    category_filter: string | null
    min_spend: Decimal | null
    discount_type: $Enums.DiscountType | null
    discount_value: Decimal | null
    max_discount: Decimal | null
    start_date: Date | null
    end_date: Date | null
    active: boolean | null
    source_url: string | null
    hash: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Benefit_offersMaxAggregateOutputType = {
    id: bigint | null
    provider_name: string | null
    payment_type: $Enums.PaymentType | null
    title: string | null
    description: string | null
    merchant_filter: string | null
    category_filter: string | null
    min_spend: Decimal | null
    discount_type: $Enums.DiscountType | null
    discount_value: Decimal | null
    max_discount: Decimal | null
    start_date: Date | null
    end_date: Date | null
    active: boolean | null
    source_url: string | null
    hash: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Benefit_offersCountAggregateOutputType = {
    id: number
    provider_name: number
    payment_type: number
    title: number
    description: number
    merchant_filter: number
    category_filter: number
    min_spend: number
    discount_type: number
    discount_value: number
    max_discount: number
    start_date: number
    end_date: number
    active: number
    source_url: number
    hash: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Benefit_offersAvgAggregateInputType = {
    id?: true
    min_spend?: true
    discount_value?: true
    max_discount?: true
  }

  export type Benefit_offersSumAggregateInputType = {
    id?: true
    min_spend?: true
    discount_value?: true
    max_discount?: true
  }

  export type Benefit_offersMinAggregateInputType = {
    id?: true
    provider_name?: true
    payment_type?: true
    title?: true
    description?: true
    merchant_filter?: true
    category_filter?: true
    min_spend?: true
    discount_type?: true
    discount_value?: true
    max_discount?: true
    start_date?: true
    end_date?: true
    active?: true
    source_url?: true
    hash?: true
    created_at?: true
    updated_at?: true
  }

  export type Benefit_offersMaxAggregateInputType = {
    id?: true
    provider_name?: true
    payment_type?: true
    title?: true
    description?: true
    merchant_filter?: true
    category_filter?: true
    min_spend?: true
    discount_type?: true
    discount_value?: true
    max_discount?: true
    start_date?: true
    end_date?: true
    active?: true
    source_url?: true
    hash?: true
    created_at?: true
    updated_at?: true
  }

  export type Benefit_offersCountAggregateInputType = {
    id?: true
    provider_name?: true
    payment_type?: true
    title?: true
    description?: true
    merchant_filter?: true
    category_filter?: true
    min_spend?: true
    discount_type?: true
    discount_value?: true
    max_discount?: true
    start_date?: true
    end_date?: true
    active?: true
    source_url?: true
    hash?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Benefit_offersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which benefit_offers to aggregate.
     */
    where?: benefit_offersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of benefit_offers to fetch.
     */
    orderBy?: benefit_offersOrderByWithRelationInput | benefit_offersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: benefit_offersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` benefit_offers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` benefit_offers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned benefit_offers
    **/
    _count?: true | Benefit_offersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Benefit_offersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Benefit_offersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Benefit_offersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Benefit_offersMaxAggregateInputType
  }

  export type GetBenefit_offersAggregateType<T extends Benefit_offersAggregateArgs> = {
        [P in keyof T & keyof AggregateBenefit_offers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBenefit_offers[P]>
      : GetScalarType<T[P], AggregateBenefit_offers[P]>
  }




  export type benefit_offersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: benefit_offersWhereInput
    orderBy?: benefit_offersOrderByWithAggregationInput | benefit_offersOrderByWithAggregationInput[]
    by: Benefit_offersScalarFieldEnum[] | Benefit_offersScalarFieldEnum
    having?: benefit_offersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Benefit_offersCountAggregateInputType | true
    _avg?: Benefit_offersAvgAggregateInputType
    _sum?: Benefit_offersSumAggregateInputType
    _min?: Benefit_offersMinAggregateInputType
    _max?: Benefit_offersMaxAggregateInputType
  }

  export type Benefit_offersGroupByOutputType = {
    id: bigint
    provider_name: string
    payment_type: $Enums.PaymentType | null
    title: string
    description: string | null
    merchant_filter: string | null
    category_filter: string | null
    min_spend: Decimal | null
    discount_type: $Enums.DiscountType
    discount_value: Decimal
    max_discount: Decimal | null
    start_date: Date | null
    end_date: Date | null
    active: boolean
    source_url: string | null
    hash: string | null
    created_at: Date
    updated_at: Date
    _count: Benefit_offersCountAggregateOutputType | null
    _avg: Benefit_offersAvgAggregateOutputType | null
    _sum: Benefit_offersSumAggregateOutputType | null
    _min: Benefit_offersMinAggregateOutputType | null
    _max: Benefit_offersMaxAggregateOutputType | null
  }

  type GetBenefit_offersGroupByPayload<T extends benefit_offersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Benefit_offersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Benefit_offersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Benefit_offersGroupByOutputType[P]>
            : GetScalarType<T[P], Benefit_offersGroupByOutputType[P]>
        }
      >
    >


  export type benefit_offersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider_name?: boolean
    payment_type?: boolean
    title?: boolean
    description?: boolean
    merchant_filter?: boolean
    category_filter?: boolean
    min_spend?: boolean
    discount_type?: boolean
    discount_value?: boolean
    max_discount?: boolean
    start_date?: boolean
    end_date?: boolean
    active?: boolean
    source_url?: boolean
    hash?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["benefit_offers"]>

  export type benefit_offersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider_name?: boolean
    payment_type?: boolean
    title?: boolean
    description?: boolean
    merchant_filter?: boolean
    category_filter?: boolean
    min_spend?: boolean
    discount_type?: boolean
    discount_value?: boolean
    max_discount?: boolean
    start_date?: boolean
    end_date?: boolean
    active?: boolean
    source_url?: boolean
    hash?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["benefit_offers"]>

  export type benefit_offersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider_name?: boolean
    payment_type?: boolean
    title?: boolean
    description?: boolean
    merchant_filter?: boolean
    category_filter?: boolean
    min_spend?: boolean
    discount_type?: boolean
    discount_value?: boolean
    max_discount?: boolean
    start_date?: boolean
    end_date?: boolean
    active?: boolean
    source_url?: boolean
    hash?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["benefit_offers"]>

  export type benefit_offersSelectScalar = {
    id?: boolean
    provider_name?: boolean
    payment_type?: boolean
    title?: boolean
    description?: boolean
    merchant_filter?: boolean
    category_filter?: boolean
    min_spend?: boolean
    discount_type?: boolean
    discount_value?: boolean
    max_discount?: boolean
    start_date?: boolean
    end_date?: boolean
    active?: boolean
    source_url?: boolean
    hash?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type benefit_offersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "provider_name" | "payment_type" | "title" | "description" | "merchant_filter" | "category_filter" | "min_spend" | "discount_type" | "discount_value" | "max_discount" | "start_date" | "end_date" | "active" | "source_url" | "hash" | "created_at" | "updated_at", ExtArgs["result"]["benefit_offers"]>

  export type $benefit_offersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "benefit_offers"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      provider_name: string
      payment_type: $Enums.PaymentType | null
      title: string
      description: string | null
      merchant_filter: string | null
      category_filter: string | null
      min_spend: Prisma.Decimal | null
      discount_type: $Enums.DiscountType
      discount_value: Prisma.Decimal
      max_discount: Prisma.Decimal | null
      start_date: Date | null
      end_date: Date | null
      active: boolean
      source_url: string | null
      hash: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["benefit_offers"]>
    composites: {}
  }

  type benefit_offersGetPayload<S extends boolean | null | undefined | benefit_offersDefaultArgs> = $Result.GetResult<Prisma.$benefit_offersPayload, S>

  type benefit_offersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<benefit_offersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Benefit_offersCountAggregateInputType | true
    }

  export interface benefit_offersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['benefit_offers'], meta: { name: 'benefit_offers' } }
    /**
     * Find zero or one Benefit_offers that matches the filter.
     * @param {benefit_offersFindUniqueArgs} args - Arguments to find a Benefit_offers
     * @example
     * // Get one Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends benefit_offersFindUniqueArgs>(args: SelectSubset<T, benefit_offersFindUniqueArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Benefit_offers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {benefit_offersFindUniqueOrThrowArgs} args - Arguments to find a Benefit_offers
     * @example
     * // Get one Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends benefit_offersFindUniqueOrThrowArgs>(args: SelectSubset<T, benefit_offersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Benefit_offers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {benefit_offersFindFirstArgs} args - Arguments to find a Benefit_offers
     * @example
     * // Get one Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends benefit_offersFindFirstArgs>(args?: SelectSubset<T, benefit_offersFindFirstArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Benefit_offers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {benefit_offersFindFirstOrThrowArgs} args - Arguments to find a Benefit_offers
     * @example
     * // Get one Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends benefit_offersFindFirstOrThrowArgs>(args?: SelectSubset<T, benefit_offersFindFirstOrThrowArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Benefit_offers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {benefit_offersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.findMany()
     * 
     * // Get first 10 Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const benefit_offersWithIdOnly = await prisma.benefit_offers.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends benefit_offersFindManyArgs>(args?: SelectSubset<T, benefit_offersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Benefit_offers.
     * @param {benefit_offersCreateArgs} args - Arguments to create a Benefit_offers.
     * @example
     * // Create one Benefit_offers
     * const Benefit_offers = await prisma.benefit_offers.create({
     *   data: {
     *     // ... data to create a Benefit_offers
     *   }
     * })
     * 
     */
    create<T extends benefit_offersCreateArgs>(args: SelectSubset<T, benefit_offersCreateArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Benefit_offers.
     * @param {benefit_offersCreateManyArgs} args - Arguments to create many Benefit_offers.
     * @example
     * // Create many Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends benefit_offersCreateManyArgs>(args?: SelectSubset<T, benefit_offersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Benefit_offers and returns the data saved in the database.
     * @param {benefit_offersCreateManyAndReturnArgs} args - Arguments to create many Benefit_offers.
     * @example
     * // Create many Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Benefit_offers and only return the `id`
     * const benefit_offersWithIdOnly = await prisma.benefit_offers.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends benefit_offersCreateManyAndReturnArgs>(args?: SelectSubset<T, benefit_offersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Benefit_offers.
     * @param {benefit_offersDeleteArgs} args - Arguments to delete one Benefit_offers.
     * @example
     * // Delete one Benefit_offers
     * const Benefit_offers = await prisma.benefit_offers.delete({
     *   where: {
     *     // ... filter to delete one Benefit_offers
     *   }
     * })
     * 
     */
    delete<T extends benefit_offersDeleteArgs>(args: SelectSubset<T, benefit_offersDeleteArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Benefit_offers.
     * @param {benefit_offersUpdateArgs} args - Arguments to update one Benefit_offers.
     * @example
     * // Update one Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends benefit_offersUpdateArgs>(args: SelectSubset<T, benefit_offersUpdateArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Benefit_offers.
     * @param {benefit_offersDeleteManyArgs} args - Arguments to filter Benefit_offers to delete.
     * @example
     * // Delete a few Benefit_offers
     * const { count } = await prisma.benefit_offers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends benefit_offersDeleteManyArgs>(args?: SelectSubset<T, benefit_offersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Benefit_offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {benefit_offersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends benefit_offersUpdateManyArgs>(args: SelectSubset<T, benefit_offersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Benefit_offers and returns the data updated in the database.
     * @param {benefit_offersUpdateManyAndReturnArgs} args - Arguments to update many Benefit_offers.
     * @example
     * // Update many Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Benefit_offers and only return the `id`
     * const benefit_offersWithIdOnly = await prisma.benefit_offers.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends benefit_offersUpdateManyAndReturnArgs>(args: SelectSubset<T, benefit_offersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Benefit_offers.
     * @param {benefit_offersUpsertArgs} args - Arguments to update or create a Benefit_offers.
     * @example
     * // Update or create a Benefit_offers
     * const benefit_offers = await prisma.benefit_offers.upsert({
     *   create: {
     *     // ... data to create a Benefit_offers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Benefit_offers we want to update
     *   }
     * })
     */
    upsert<T extends benefit_offersUpsertArgs>(args: SelectSubset<T, benefit_offersUpsertArgs<ExtArgs>>): Prisma__benefit_offersClient<$Result.GetResult<Prisma.$benefit_offersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Benefit_offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {benefit_offersCountArgs} args - Arguments to filter Benefit_offers to count.
     * @example
     * // Count the number of Benefit_offers
     * const count = await prisma.benefit_offers.count({
     *   where: {
     *     // ... the filter for the Benefit_offers we want to count
     *   }
     * })
    **/
    count<T extends benefit_offersCountArgs>(
      args?: Subset<T, benefit_offersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Benefit_offersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Benefit_offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Benefit_offersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Benefit_offersAggregateArgs>(args: Subset<T, Benefit_offersAggregateArgs>): Prisma.PrismaPromise<GetBenefit_offersAggregateType<T>>

    /**
     * Group by Benefit_offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {benefit_offersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends benefit_offersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: benefit_offersGroupByArgs['orderBy'] }
        : { orderBy?: benefit_offersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, benefit_offersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBenefit_offersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the benefit_offers model
   */
  readonly fields: benefit_offersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for benefit_offers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__benefit_offersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the benefit_offers model
   */
  interface benefit_offersFieldRefs {
    readonly id: FieldRef<"benefit_offers", 'BigInt'>
    readonly provider_name: FieldRef<"benefit_offers", 'String'>
    readonly payment_type: FieldRef<"benefit_offers", 'PaymentType'>
    readonly title: FieldRef<"benefit_offers", 'String'>
    readonly description: FieldRef<"benefit_offers", 'String'>
    readonly merchant_filter: FieldRef<"benefit_offers", 'String'>
    readonly category_filter: FieldRef<"benefit_offers", 'String'>
    readonly min_spend: FieldRef<"benefit_offers", 'Decimal'>
    readonly discount_type: FieldRef<"benefit_offers", 'DiscountType'>
    readonly discount_value: FieldRef<"benefit_offers", 'Decimal'>
    readonly max_discount: FieldRef<"benefit_offers", 'Decimal'>
    readonly start_date: FieldRef<"benefit_offers", 'DateTime'>
    readonly end_date: FieldRef<"benefit_offers", 'DateTime'>
    readonly active: FieldRef<"benefit_offers", 'Boolean'>
    readonly source_url: FieldRef<"benefit_offers", 'String'>
    readonly hash: FieldRef<"benefit_offers", 'String'>
    readonly created_at: FieldRef<"benefit_offers", 'DateTime'>
    readonly updated_at: FieldRef<"benefit_offers", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * benefit_offers findUnique
   */
  export type benefit_offersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * Filter, which benefit_offers to fetch.
     */
    where: benefit_offersWhereUniqueInput
  }

  /**
   * benefit_offers findUniqueOrThrow
   */
  export type benefit_offersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * Filter, which benefit_offers to fetch.
     */
    where: benefit_offersWhereUniqueInput
  }

  /**
   * benefit_offers findFirst
   */
  export type benefit_offersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * Filter, which benefit_offers to fetch.
     */
    where?: benefit_offersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of benefit_offers to fetch.
     */
    orderBy?: benefit_offersOrderByWithRelationInput | benefit_offersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for benefit_offers.
     */
    cursor?: benefit_offersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` benefit_offers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` benefit_offers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of benefit_offers.
     */
    distinct?: Benefit_offersScalarFieldEnum | Benefit_offersScalarFieldEnum[]
  }

  /**
   * benefit_offers findFirstOrThrow
   */
  export type benefit_offersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * Filter, which benefit_offers to fetch.
     */
    where?: benefit_offersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of benefit_offers to fetch.
     */
    orderBy?: benefit_offersOrderByWithRelationInput | benefit_offersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for benefit_offers.
     */
    cursor?: benefit_offersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` benefit_offers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` benefit_offers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of benefit_offers.
     */
    distinct?: Benefit_offersScalarFieldEnum | Benefit_offersScalarFieldEnum[]
  }

  /**
   * benefit_offers findMany
   */
  export type benefit_offersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * Filter, which benefit_offers to fetch.
     */
    where?: benefit_offersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of benefit_offers to fetch.
     */
    orderBy?: benefit_offersOrderByWithRelationInput | benefit_offersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing benefit_offers.
     */
    cursor?: benefit_offersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` benefit_offers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` benefit_offers.
     */
    skip?: number
    distinct?: Benefit_offersScalarFieldEnum | Benefit_offersScalarFieldEnum[]
  }

  /**
   * benefit_offers create
   */
  export type benefit_offersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * The data needed to create a benefit_offers.
     */
    data: XOR<benefit_offersCreateInput, benefit_offersUncheckedCreateInput>
  }

  /**
   * benefit_offers createMany
   */
  export type benefit_offersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many benefit_offers.
     */
    data: benefit_offersCreateManyInput | benefit_offersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * benefit_offers createManyAndReturn
   */
  export type benefit_offersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * The data used to create many benefit_offers.
     */
    data: benefit_offersCreateManyInput | benefit_offersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * benefit_offers update
   */
  export type benefit_offersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * The data needed to update a benefit_offers.
     */
    data: XOR<benefit_offersUpdateInput, benefit_offersUncheckedUpdateInput>
    /**
     * Choose, which benefit_offers to update.
     */
    where: benefit_offersWhereUniqueInput
  }

  /**
   * benefit_offers updateMany
   */
  export type benefit_offersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update benefit_offers.
     */
    data: XOR<benefit_offersUpdateManyMutationInput, benefit_offersUncheckedUpdateManyInput>
    /**
     * Filter which benefit_offers to update
     */
    where?: benefit_offersWhereInput
    /**
     * Limit how many benefit_offers to update.
     */
    limit?: number
  }

  /**
   * benefit_offers updateManyAndReturn
   */
  export type benefit_offersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * The data used to update benefit_offers.
     */
    data: XOR<benefit_offersUpdateManyMutationInput, benefit_offersUncheckedUpdateManyInput>
    /**
     * Filter which benefit_offers to update
     */
    where?: benefit_offersWhereInput
    /**
     * Limit how many benefit_offers to update.
     */
    limit?: number
  }

  /**
   * benefit_offers upsert
   */
  export type benefit_offersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * The filter to search for the benefit_offers to update in case it exists.
     */
    where: benefit_offersWhereUniqueInput
    /**
     * In case the benefit_offers found by the `where` argument doesn't exist, create a new benefit_offers with this data.
     */
    create: XOR<benefit_offersCreateInput, benefit_offersUncheckedCreateInput>
    /**
     * In case the benefit_offers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<benefit_offersUpdateInput, benefit_offersUncheckedUpdateInput>
  }

  /**
   * benefit_offers delete
   */
  export type benefit_offersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
    /**
     * Filter which benefit_offers to delete.
     */
    where: benefit_offersWhereUniqueInput
  }

  /**
   * benefit_offers deleteMany
   */
  export type benefit_offersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which benefit_offers to delete
     */
    where?: benefit_offersWhereInput
    /**
     * Limit how many benefit_offers to delete.
     */
    limit?: number
  }

  /**
   * benefit_offers without action
   */
  export type benefit_offersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the benefit_offers
     */
    select?: benefit_offersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the benefit_offers
     */
    omit?: benefit_offersOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsersScalarFieldEnum: {
    seq: 'seq',
    uuid: 'uuid',
    email: 'email',
    password_hash: 'password_hash',
    social_provider: 'social_provider',
    social_id: 'social_id',
    name: 'name',
    preferred_payment_seq: 'preferred_payment_seq',
    is_verified: 'is_verified',
    verified_at: 'verified_at',
    ci: 'ci',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const Payment_methodsScalarFieldEnum: {
    seq: 'seq',
    user_uuid: 'user_uuid',
    type: 'type',
    card_number_hash: 'card_number_hash',
    last_4_nums: 'last_4_nums',
    card_holder_name: 'card_holder_name',
    provider_name: 'provider_name',
    card_brand: 'card_brand',
    expiry_month: 'expiry_month',
    expiry_year: 'expiry_year',
    cvv_hash: 'cvv_hash',
    billing_address: 'billing_address',
    billing_zip: 'billing_zip',
    alias: 'alias',
    is_primary: 'is_primary',
    billing_key_id: 'billing_key_id',
    billing_key_status: 'billing_key_status',
    operator: 'operator',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Payment_methodsScalarFieldEnum = (typeof Payment_methodsScalarFieldEnum)[keyof typeof Payment_methodsScalarFieldEnum]


  export const User_sessionsScalarFieldEnum: {
    seq: 'seq',
    user_seq: 'user_seq',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_at: 'expires_at',
    device_info: 'device_info',
    created_at: 'created_at'
  };

  export type User_sessionsScalarFieldEnum = (typeof User_sessionsScalarFieldEnum)[keyof typeof User_sessionsScalarFieldEnum]


  export const User_settingsScalarFieldEnum: {
    user_seq: 'user_seq',
    dark_mode: 'dark_mode',
    notification_enabled: 'notification_enabled',
    compare_mode: 'compare_mode',
    currency_preference: 'currency_preference',
    updated_at: 'updated_at'
  };

  export type User_settingsScalarFieldEnum = (typeof User_settingsScalarFieldEnum)[keyof typeof User_settingsScalarFieldEnum]


  export const Payment_transactionsScalarFieldEnum: {
    seq: 'seq',
    uuid: 'uuid',
    user_uuid: 'user_uuid',
    payment_method_seq: 'payment_method_seq',
    merchant_name: 'merchant_name',
    amount: 'amount',
    currency: 'currency',
    benefit_value: 'benefit_value',
    benefit_desc: 'benefit_desc',
    compared_at: 'compared_at',
    portone_payment_id: 'portone_payment_id',
    portone_transaction_id: 'portone_transaction_id',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Payment_transactionsScalarFieldEnum = (typeof Payment_transactionsScalarFieldEnum)[keyof typeof Payment_transactionsScalarFieldEnum]


  export const Identity_verificationsScalarFieldEnum: {
    seq: 'seq',
    uuid: 'uuid',
    user_uuid: 'user_uuid',
    portone_id: 'portone_id',
    channel_key: 'channel_key',
    operator: 'operator',
    method: 'method',
    status: 'status',
    customer_name: 'customer_name',
    customer_phone: 'customer_phone',
    customer_email: 'customer_email',
    ci: 'ci',
    di: 'di',
    custom_data: 'custom_data',
    requested_at: 'requested_at',
    status_changed_at: 'status_changed_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Identity_verificationsScalarFieldEnum = (typeof Identity_verificationsScalarFieldEnum)[keyof typeof Identity_verificationsScalarFieldEnum]


  export const Benefit_offersScalarFieldEnum: {
    id: 'id',
    provider_name: 'provider_name',
    payment_type: 'payment_type',
    title: 'title',
    description: 'description',
    merchant_filter: 'merchant_filter',
    category_filter: 'category_filter',
    min_spend: 'min_spend',
    discount_type: 'discount_type',
    discount_value: 'discount_value',
    max_discount: 'max_discount',
    start_date: 'start_date',
    end_date: 'end_date',
    active: 'active',
    source_url: 'source_url',
    hash: 'hash',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Benefit_offersScalarFieldEnum = (typeof Benefit_offersScalarFieldEnum)[keyof typeof Benefit_offersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PaymentType'
   */
  export type EnumPaymentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentType'>
    


  /**
   * Reference to a field of type 'PaymentType[]'
   */
  export type ListEnumPaymentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentType[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DiscountType'
   */
  export type EnumDiscountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiscountType'>
    


  /**
   * Reference to a field of type 'DiscountType[]'
   */
  export type ListEnumDiscountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiscountType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    seq?: BigIntFilter<"users"> | bigint | number
    uuid?: StringFilter<"users"> | string
    email?: StringNullableFilter<"users"> | string | null
    password_hash?: StringNullableFilter<"users"> | string | null
    social_provider?: StringFilter<"users"> | string
    social_id?: StringNullableFilter<"users"> | string | null
    name?: StringFilter<"users"> | string
    preferred_payment_seq?: BigIntNullableFilter<"users"> | bigint | number | null
    is_verified?: BoolFilter<"users"> | boolean
    verified_at?: DateTimeNullableFilter<"users"> | Date | string | null
    ci?: StringNullableFilter<"users"> | string | null
    created_at?: DateTimeFilter<"users"> | Date | string
    updated_at?: DateTimeFilter<"users"> | Date | string
    payment_methods?: Payment_methodsListRelationFilter
    user_sessions?: User_sessionsListRelationFilter
    user_settings?: XOR<User_settingsNullableScalarRelationFilter, user_settingsWhereInput> | null
    payment_transactions?: Payment_transactionsListRelationFilter
    identity_verifications?: Identity_verificationsListRelationFilter
  }

  export type usersOrderByWithRelationInput = {
    seq?: SortOrder
    uuid?: SortOrder
    email?: SortOrderInput | SortOrder
    password_hash?: SortOrderInput | SortOrder
    social_provider?: SortOrder
    social_id?: SortOrderInput | SortOrder
    name?: SortOrder
    preferred_payment_seq?: SortOrderInput | SortOrder
    is_verified?: SortOrder
    verified_at?: SortOrderInput | SortOrder
    ci?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    payment_methods?: payment_methodsOrderByRelationAggregateInput
    user_sessions?: user_sessionsOrderByRelationAggregateInput
    user_settings?: user_settingsOrderByWithRelationInput
    payment_transactions?: payment_transactionsOrderByRelationAggregateInput
    identity_verifications?: identity_verificationsOrderByRelationAggregateInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    seq?: bigint | number
    uuid?: string
    email?: string
    ci?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    password_hash?: StringNullableFilter<"users"> | string | null
    social_provider?: StringFilter<"users"> | string
    social_id?: StringNullableFilter<"users"> | string | null
    name?: StringFilter<"users"> | string
    preferred_payment_seq?: BigIntNullableFilter<"users"> | bigint | number | null
    is_verified?: BoolFilter<"users"> | boolean
    verified_at?: DateTimeNullableFilter<"users"> | Date | string | null
    created_at?: DateTimeFilter<"users"> | Date | string
    updated_at?: DateTimeFilter<"users"> | Date | string
    payment_methods?: Payment_methodsListRelationFilter
    user_sessions?: User_sessionsListRelationFilter
    user_settings?: XOR<User_settingsNullableScalarRelationFilter, user_settingsWhereInput> | null
    payment_transactions?: Payment_transactionsListRelationFilter
    identity_verifications?: Identity_verificationsListRelationFilter
  }, "seq" | "uuid" | "email" | "ci">

  export type usersOrderByWithAggregationInput = {
    seq?: SortOrder
    uuid?: SortOrder
    email?: SortOrderInput | SortOrder
    password_hash?: SortOrderInput | SortOrder
    social_provider?: SortOrder
    social_id?: SortOrderInput | SortOrder
    name?: SortOrder
    preferred_payment_seq?: SortOrderInput | SortOrder
    is_verified?: SortOrder
    verified_at?: SortOrderInput | SortOrder
    ci?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    seq?: BigIntWithAggregatesFilter<"users"> | bigint | number
    uuid?: StringWithAggregatesFilter<"users"> | string
    email?: StringNullableWithAggregatesFilter<"users"> | string | null
    password_hash?: StringNullableWithAggregatesFilter<"users"> | string | null
    social_provider?: StringWithAggregatesFilter<"users"> | string
    social_id?: StringNullableWithAggregatesFilter<"users"> | string | null
    name?: StringWithAggregatesFilter<"users"> | string
    preferred_payment_seq?: BigIntNullableWithAggregatesFilter<"users"> | bigint | number | null
    is_verified?: BoolWithAggregatesFilter<"users"> | boolean
    verified_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    ci?: StringNullableWithAggregatesFilter<"users"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
  }

  export type payment_methodsWhereInput = {
    AND?: payment_methodsWhereInput | payment_methodsWhereInput[]
    OR?: payment_methodsWhereInput[]
    NOT?: payment_methodsWhereInput | payment_methodsWhereInput[]
    seq?: BigIntFilter<"payment_methods"> | bigint | number
    user_uuid?: StringFilter<"payment_methods"> | string
    type?: EnumPaymentTypeFilter<"payment_methods"> | $Enums.PaymentType
    card_number_hash?: StringNullableFilter<"payment_methods"> | string | null
    last_4_nums?: StringFilter<"payment_methods"> | string
    card_holder_name?: StringNullableFilter<"payment_methods"> | string | null
    provider_name?: StringFilter<"payment_methods"> | string
    card_brand?: StringNullableFilter<"payment_methods"> | string | null
    expiry_month?: StringNullableFilter<"payment_methods"> | string | null
    expiry_year?: StringNullableFilter<"payment_methods"> | string | null
    cvv_hash?: StringNullableFilter<"payment_methods"> | string | null
    billing_address?: StringNullableFilter<"payment_methods"> | string | null
    billing_zip?: StringNullableFilter<"payment_methods"> | string | null
    alias?: StringNullableFilter<"payment_methods"> | string | null
    is_primary?: BoolFilter<"payment_methods"> | boolean
    billing_key_id?: StringNullableFilter<"payment_methods"> | string | null
    billing_key_status?: StringNullableFilter<"payment_methods"> | string | null
    operator?: StringNullableFilter<"payment_methods"> | string | null
    created_at?: DateTimeFilter<"payment_methods"> | Date | string
    updated_at?: DateTimeFilter<"payment_methods"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type payment_methodsOrderByWithRelationInput = {
    seq?: SortOrder
    user_uuid?: SortOrder
    type?: SortOrder
    card_number_hash?: SortOrderInput | SortOrder
    last_4_nums?: SortOrder
    card_holder_name?: SortOrderInput | SortOrder
    provider_name?: SortOrder
    card_brand?: SortOrderInput | SortOrder
    expiry_month?: SortOrderInput | SortOrder
    expiry_year?: SortOrderInput | SortOrder
    cvv_hash?: SortOrderInput | SortOrder
    billing_address?: SortOrderInput | SortOrder
    billing_zip?: SortOrderInput | SortOrder
    alias?: SortOrderInput | SortOrder
    is_primary?: SortOrder
    billing_key_id?: SortOrderInput | SortOrder
    billing_key_status?: SortOrderInput | SortOrder
    operator?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: usersOrderByWithRelationInput
  }

  export type payment_methodsWhereUniqueInput = Prisma.AtLeast<{
    seq?: bigint | number
    billing_key_id?: string
    AND?: payment_methodsWhereInput | payment_methodsWhereInput[]
    OR?: payment_methodsWhereInput[]
    NOT?: payment_methodsWhereInput | payment_methodsWhereInput[]
    user_uuid?: StringFilter<"payment_methods"> | string
    type?: EnumPaymentTypeFilter<"payment_methods"> | $Enums.PaymentType
    card_number_hash?: StringNullableFilter<"payment_methods"> | string | null
    last_4_nums?: StringFilter<"payment_methods"> | string
    card_holder_name?: StringNullableFilter<"payment_methods"> | string | null
    provider_name?: StringFilter<"payment_methods"> | string
    card_brand?: StringNullableFilter<"payment_methods"> | string | null
    expiry_month?: StringNullableFilter<"payment_methods"> | string | null
    expiry_year?: StringNullableFilter<"payment_methods"> | string | null
    cvv_hash?: StringNullableFilter<"payment_methods"> | string | null
    billing_address?: StringNullableFilter<"payment_methods"> | string | null
    billing_zip?: StringNullableFilter<"payment_methods"> | string | null
    alias?: StringNullableFilter<"payment_methods"> | string | null
    is_primary?: BoolFilter<"payment_methods"> | boolean
    billing_key_status?: StringNullableFilter<"payment_methods"> | string | null
    operator?: StringNullableFilter<"payment_methods"> | string | null
    created_at?: DateTimeFilter<"payment_methods"> | Date | string
    updated_at?: DateTimeFilter<"payment_methods"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "seq" | "billing_key_id">

  export type payment_methodsOrderByWithAggregationInput = {
    seq?: SortOrder
    user_uuid?: SortOrder
    type?: SortOrder
    card_number_hash?: SortOrderInput | SortOrder
    last_4_nums?: SortOrder
    card_holder_name?: SortOrderInput | SortOrder
    provider_name?: SortOrder
    card_brand?: SortOrderInput | SortOrder
    expiry_month?: SortOrderInput | SortOrder
    expiry_year?: SortOrderInput | SortOrder
    cvv_hash?: SortOrderInput | SortOrder
    billing_address?: SortOrderInput | SortOrder
    billing_zip?: SortOrderInput | SortOrder
    alias?: SortOrderInput | SortOrder
    is_primary?: SortOrder
    billing_key_id?: SortOrderInput | SortOrder
    billing_key_status?: SortOrderInput | SortOrder
    operator?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: payment_methodsCountOrderByAggregateInput
    _avg?: payment_methodsAvgOrderByAggregateInput
    _max?: payment_methodsMaxOrderByAggregateInput
    _min?: payment_methodsMinOrderByAggregateInput
    _sum?: payment_methodsSumOrderByAggregateInput
  }

  export type payment_methodsScalarWhereWithAggregatesInput = {
    AND?: payment_methodsScalarWhereWithAggregatesInput | payment_methodsScalarWhereWithAggregatesInput[]
    OR?: payment_methodsScalarWhereWithAggregatesInput[]
    NOT?: payment_methodsScalarWhereWithAggregatesInput | payment_methodsScalarWhereWithAggregatesInput[]
    seq?: BigIntWithAggregatesFilter<"payment_methods"> | bigint | number
    user_uuid?: StringWithAggregatesFilter<"payment_methods"> | string
    type?: EnumPaymentTypeWithAggregatesFilter<"payment_methods"> | $Enums.PaymentType
    card_number_hash?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    last_4_nums?: StringWithAggregatesFilter<"payment_methods"> | string
    card_holder_name?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    provider_name?: StringWithAggregatesFilter<"payment_methods"> | string
    card_brand?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    expiry_month?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    expiry_year?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    cvv_hash?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    billing_address?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    billing_zip?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    alias?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    is_primary?: BoolWithAggregatesFilter<"payment_methods"> | boolean
    billing_key_id?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    billing_key_status?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    operator?: StringNullableWithAggregatesFilter<"payment_methods"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"payment_methods"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"payment_methods"> | Date | string
  }

  export type user_sessionsWhereInput = {
    AND?: user_sessionsWhereInput | user_sessionsWhereInput[]
    OR?: user_sessionsWhereInput[]
    NOT?: user_sessionsWhereInput | user_sessionsWhereInput[]
    seq?: BigIntFilter<"user_sessions"> | bigint | number
    user_seq?: BigIntFilter<"user_sessions"> | bigint | number
    access_token?: StringFilter<"user_sessions"> | string
    refresh_token?: StringFilter<"user_sessions"> | string
    expires_at?: DateTimeFilter<"user_sessions"> | Date | string
    device_info?: StringNullableFilter<"user_sessions"> | string | null
    created_at?: DateTimeFilter<"user_sessions"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type user_sessionsOrderByWithRelationInput = {
    seq?: SortOrder
    user_seq?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires_at?: SortOrder
    device_info?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: usersOrderByWithRelationInput
  }

  export type user_sessionsWhereUniqueInput = Prisma.AtLeast<{
    seq?: bigint | number
    AND?: user_sessionsWhereInput | user_sessionsWhereInput[]
    OR?: user_sessionsWhereInput[]
    NOT?: user_sessionsWhereInput | user_sessionsWhereInput[]
    user_seq?: BigIntFilter<"user_sessions"> | bigint | number
    access_token?: StringFilter<"user_sessions"> | string
    refresh_token?: StringFilter<"user_sessions"> | string
    expires_at?: DateTimeFilter<"user_sessions"> | Date | string
    device_info?: StringNullableFilter<"user_sessions"> | string | null
    created_at?: DateTimeFilter<"user_sessions"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "seq">

  export type user_sessionsOrderByWithAggregationInput = {
    seq?: SortOrder
    user_seq?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires_at?: SortOrder
    device_info?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: user_sessionsCountOrderByAggregateInput
    _avg?: user_sessionsAvgOrderByAggregateInput
    _max?: user_sessionsMaxOrderByAggregateInput
    _min?: user_sessionsMinOrderByAggregateInput
    _sum?: user_sessionsSumOrderByAggregateInput
  }

  export type user_sessionsScalarWhereWithAggregatesInput = {
    AND?: user_sessionsScalarWhereWithAggregatesInput | user_sessionsScalarWhereWithAggregatesInput[]
    OR?: user_sessionsScalarWhereWithAggregatesInput[]
    NOT?: user_sessionsScalarWhereWithAggregatesInput | user_sessionsScalarWhereWithAggregatesInput[]
    seq?: BigIntWithAggregatesFilter<"user_sessions"> | bigint | number
    user_seq?: BigIntWithAggregatesFilter<"user_sessions"> | bigint | number
    access_token?: StringWithAggregatesFilter<"user_sessions"> | string
    refresh_token?: StringWithAggregatesFilter<"user_sessions"> | string
    expires_at?: DateTimeWithAggregatesFilter<"user_sessions"> | Date | string
    device_info?: StringNullableWithAggregatesFilter<"user_sessions"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"user_sessions"> | Date | string
  }

  export type user_settingsWhereInput = {
    AND?: user_settingsWhereInput | user_settingsWhereInput[]
    OR?: user_settingsWhereInput[]
    NOT?: user_settingsWhereInput | user_settingsWhereInput[]
    user_seq?: BigIntFilter<"user_settings"> | bigint | number
    dark_mode?: BoolFilter<"user_settings"> | boolean
    notification_enabled?: BoolFilter<"user_settings"> | boolean
    compare_mode?: StringFilter<"user_settings"> | string
    currency_preference?: StringFilter<"user_settings"> | string
    updated_at?: DateTimeFilter<"user_settings"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type user_settingsOrderByWithRelationInput = {
    user_seq?: SortOrder
    dark_mode?: SortOrder
    notification_enabled?: SortOrder
    compare_mode?: SortOrder
    currency_preference?: SortOrder
    updated_at?: SortOrder
    user?: usersOrderByWithRelationInput
  }

  export type user_settingsWhereUniqueInput = Prisma.AtLeast<{
    user_seq?: bigint | number
    AND?: user_settingsWhereInput | user_settingsWhereInput[]
    OR?: user_settingsWhereInput[]
    NOT?: user_settingsWhereInput | user_settingsWhereInput[]
    dark_mode?: BoolFilter<"user_settings"> | boolean
    notification_enabled?: BoolFilter<"user_settings"> | boolean
    compare_mode?: StringFilter<"user_settings"> | string
    currency_preference?: StringFilter<"user_settings"> | string
    updated_at?: DateTimeFilter<"user_settings"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "user_seq">

  export type user_settingsOrderByWithAggregationInput = {
    user_seq?: SortOrder
    dark_mode?: SortOrder
    notification_enabled?: SortOrder
    compare_mode?: SortOrder
    currency_preference?: SortOrder
    updated_at?: SortOrder
    _count?: user_settingsCountOrderByAggregateInput
    _avg?: user_settingsAvgOrderByAggregateInput
    _max?: user_settingsMaxOrderByAggregateInput
    _min?: user_settingsMinOrderByAggregateInput
    _sum?: user_settingsSumOrderByAggregateInput
  }

  export type user_settingsScalarWhereWithAggregatesInput = {
    AND?: user_settingsScalarWhereWithAggregatesInput | user_settingsScalarWhereWithAggregatesInput[]
    OR?: user_settingsScalarWhereWithAggregatesInput[]
    NOT?: user_settingsScalarWhereWithAggregatesInput | user_settingsScalarWhereWithAggregatesInput[]
    user_seq?: BigIntWithAggregatesFilter<"user_settings"> | bigint | number
    dark_mode?: BoolWithAggregatesFilter<"user_settings"> | boolean
    notification_enabled?: BoolWithAggregatesFilter<"user_settings"> | boolean
    compare_mode?: StringWithAggregatesFilter<"user_settings"> | string
    currency_preference?: StringWithAggregatesFilter<"user_settings"> | string
    updated_at?: DateTimeWithAggregatesFilter<"user_settings"> | Date | string
  }

  export type payment_transactionsWhereInput = {
    AND?: payment_transactionsWhereInput | payment_transactionsWhereInput[]
    OR?: payment_transactionsWhereInput[]
    NOT?: payment_transactionsWhereInput | payment_transactionsWhereInput[]
    seq?: BigIntFilter<"payment_transactions"> | bigint | number
    uuid?: UuidFilter<"payment_transactions"> | string
    user_uuid?: StringFilter<"payment_transactions"> | string
    payment_method_seq?: BigIntNullableFilter<"payment_transactions"> | bigint | number | null
    merchant_name?: StringFilter<"payment_transactions"> | string
    amount?: DecimalFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"payment_transactions"> | string
    benefit_value?: DecimalNullableFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: StringNullableFilter<"payment_transactions"> | string | null
    compared_at?: DateTimeNullableFilter<"payment_transactions"> | Date | string | null
    portone_payment_id?: StringNullableFilter<"payment_transactions"> | string | null
    portone_transaction_id?: StringNullableFilter<"payment_transactions"> | string | null
    status?: StringFilter<"payment_transactions"> | string
    created_at?: DateTimeFilter<"payment_transactions"> | Date | string
    updated_at?: DateTimeFilter<"payment_transactions"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type payment_transactionsOrderByWithRelationInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    payment_method_seq?: SortOrderInput | SortOrder
    merchant_name?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    benefit_value?: SortOrderInput | SortOrder
    benefit_desc?: SortOrderInput | SortOrder
    compared_at?: SortOrderInput | SortOrder
    portone_payment_id?: SortOrderInput | SortOrder
    portone_transaction_id?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: usersOrderByWithRelationInput
  }

  export type payment_transactionsWhereUniqueInput = Prisma.AtLeast<{
    seq?: bigint | number
    uuid?: string
    portone_payment_id?: string
    AND?: payment_transactionsWhereInput | payment_transactionsWhereInput[]
    OR?: payment_transactionsWhereInput[]
    NOT?: payment_transactionsWhereInput | payment_transactionsWhereInput[]
    user_uuid?: StringFilter<"payment_transactions"> | string
    payment_method_seq?: BigIntNullableFilter<"payment_transactions"> | bigint | number | null
    merchant_name?: StringFilter<"payment_transactions"> | string
    amount?: DecimalFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"payment_transactions"> | string
    benefit_value?: DecimalNullableFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: StringNullableFilter<"payment_transactions"> | string | null
    compared_at?: DateTimeNullableFilter<"payment_transactions"> | Date | string | null
    portone_transaction_id?: StringNullableFilter<"payment_transactions"> | string | null
    status?: StringFilter<"payment_transactions"> | string
    created_at?: DateTimeFilter<"payment_transactions"> | Date | string
    updated_at?: DateTimeFilter<"payment_transactions"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "seq" | "uuid" | "portone_payment_id">

  export type payment_transactionsOrderByWithAggregationInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    payment_method_seq?: SortOrderInput | SortOrder
    merchant_name?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    benefit_value?: SortOrderInput | SortOrder
    benefit_desc?: SortOrderInput | SortOrder
    compared_at?: SortOrderInput | SortOrder
    portone_payment_id?: SortOrderInput | SortOrder
    portone_transaction_id?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: payment_transactionsCountOrderByAggregateInput
    _avg?: payment_transactionsAvgOrderByAggregateInput
    _max?: payment_transactionsMaxOrderByAggregateInput
    _min?: payment_transactionsMinOrderByAggregateInput
    _sum?: payment_transactionsSumOrderByAggregateInput
  }

  export type payment_transactionsScalarWhereWithAggregatesInput = {
    AND?: payment_transactionsScalarWhereWithAggregatesInput | payment_transactionsScalarWhereWithAggregatesInput[]
    OR?: payment_transactionsScalarWhereWithAggregatesInput[]
    NOT?: payment_transactionsScalarWhereWithAggregatesInput | payment_transactionsScalarWhereWithAggregatesInput[]
    seq?: BigIntWithAggregatesFilter<"payment_transactions"> | bigint | number
    uuid?: UuidWithAggregatesFilter<"payment_transactions"> | string
    user_uuid?: StringWithAggregatesFilter<"payment_transactions"> | string
    payment_method_seq?: BigIntNullableWithAggregatesFilter<"payment_transactions"> | bigint | number | null
    merchant_name?: StringWithAggregatesFilter<"payment_transactions"> | string
    amount?: DecimalWithAggregatesFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"payment_transactions"> | string
    benefit_value?: DecimalNullableWithAggregatesFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: StringNullableWithAggregatesFilter<"payment_transactions"> | string | null
    compared_at?: DateTimeNullableWithAggregatesFilter<"payment_transactions"> | Date | string | null
    portone_payment_id?: StringNullableWithAggregatesFilter<"payment_transactions"> | string | null
    portone_transaction_id?: StringNullableWithAggregatesFilter<"payment_transactions"> | string | null
    status?: StringWithAggregatesFilter<"payment_transactions"> | string
    created_at?: DateTimeWithAggregatesFilter<"payment_transactions"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"payment_transactions"> | Date | string
  }

  export type identity_verificationsWhereInput = {
    AND?: identity_verificationsWhereInput | identity_verificationsWhereInput[]
    OR?: identity_verificationsWhereInput[]
    NOT?: identity_verificationsWhereInput | identity_verificationsWhereInput[]
    seq?: BigIntFilter<"identity_verifications"> | bigint | number
    uuid?: UuidFilter<"identity_verifications"> | string
    user_uuid?: StringFilter<"identity_verifications"> | string
    portone_id?: StringFilter<"identity_verifications"> | string
    channel_key?: StringFilter<"identity_verifications"> | string
    operator?: StringFilter<"identity_verifications"> | string
    method?: StringFilter<"identity_verifications"> | string
    status?: StringFilter<"identity_verifications"> | string
    customer_name?: StringNullableFilter<"identity_verifications"> | string | null
    customer_phone?: StringNullableFilter<"identity_verifications"> | string | null
    customer_email?: StringNullableFilter<"identity_verifications"> | string | null
    ci?: StringNullableFilter<"identity_verifications"> | string | null
    di?: StringNullableFilter<"identity_verifications"> | string | null
    custom_data?: StringNullableFilter<"identity_verifications"> | string | null
    requested_at?: DateTimeFilter<"identity_verifications"> | Date | string
    status_changed_at?: DateTimeFilter<"identity_verifications"> | Date | string
    created_at?: DateTimeFilter<"identity_verifications"> | Date | string
    updated_at?: DateTimeFilter<"identity_verifications"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type identity_verificationsOrderByWithRelationInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    portone_id?: SortOrder
    channel_key?: SortOrder
    operator?: SortOrder
    method?: SortOrder
    status?: SortOrder
    customer_name?: SortOrderInput | SortOrder
    customer_phone?: SortOrderInput | SortOrder
    customer_email?: SortOrderInput | SortOrder
    ci?: SortOrderInput | SortOrder
    di?: SortOrderInput | SortOrder
    custom_data?: SortOrderInput | SortOrder
    requested_at?: SortOrder
    status_changed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: usersOrderByWithRelationInput
  }

  export type identity_verificationsWhereUniqueInput = Prisma.AtLeast<{
    seq?: bigint | number
    uuid?: string
    portone_id?: string
    ci?: string
    AND?: identity_verificationsWhereInput | identity_verificationsWhereInput[]
    OR?: identity_verificationsWhereInput[]
    NOT?: identity_verificationsWhereInput | identity_verificationsWhereInput[]
    user_uuid?: StringFilter<"identity_verifications"> | string
    channel_key?: StringFilter<"identity_verifications"> | string
    operator?: StringFilter<"identity_verifications"> | string
    method?: StringFilter<"identity_verifications"> | string
    status?: StringFilter<"identity_verifications"> | string
    customer_name?: StringNullableFilter<"identity_verifications"> | string | null
    customer_phone?: StringNullableFilter<"identity_verifications"> | string | null
    customer_email?: StringNullableFilter<"identity_verifications"> | string | null
    di?: StringNullableFilter<"identity_verifications"> | string | null
    custom_data?: StringNullableFilter<"identity_verifications"> | string | null
    requested_at?: DateTimeFilter<"identity_verifications"> | Date | string
    status_changed_at?: DateTimeFilter<"identity_verifications"> | Date | string
    created_at?: DateTimeFilter<"identity_verifications"> | Date | string
    updated_at?: DateTimeFilter<"identity_verifications"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "seq" | "uuid" | "portone_id" | "ci">

  export type identity_verificationsOrderByWithAggregationInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    portone_id?: SortOrder
    channel_key?: SortOrder
    operator?: SortOrder
    method?: SortOrder
    status?: SortOrder
    customer_name?: SortOrderInput | SortOrder
    customer_phone?: SortOrderInput | SortOrder
    customer_email?: SortOrderInput | SortOrder
    ci?: SortOrderInput | SortOrder
    di?: SortOrderInput | SortOrder
    custom_data?: SortOrderInput | SortOrder
    requested_at?: SortOrder
    status_changed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: identity_verificationsCountOrderByAggregateInput
    _avg?: identity_verificationsAvgOrderByAggregateInput
    _max?: identity_verificationsMaxOrderByAggregateInput
    _min?: identity_verificationsMinOrderByAggregateInput
    _sum?: identity_verificationsSumOrderByAggregateInput
  }

  export type identity_verificationsScalarWhereWithAggregatesInput = {
    AND?: identity_verificationsScalarWhereWithAggregatesInput | identity_verificationsScalarWhereWithAggregatesInput[]
    OR?: identity_verificationsScalarWhereWithAggregatesInput[]
    NOT?: identity_verificationsScalarWhereWithAggregatesInput | identity_verificationsScalarWhereWithAggregatesInput[]
    seq?: BigIntWithAggregatesFilter<"identity_verifications"> | bigint | number
    uuid?: UuidWithAggregatesFilter<"identity_verifications"> | string
    user_uuid?: StringWithAggregatesFilter<"identity_verifications"> | string
    portone_id?: StringWithAggregatesFilter<"identity_verifications"> | string
    channel_key?: StringWithAggregatesFilter<"identity_verifications"> | string
    operator?: StringWithAggregatesFilter<"identity_verifications"> | string
    method?: StringWithAggregatesFilter<"identity_verifications"> | string
    status?: StringWithAggregatesFilter<"identity_verifications"> | string
    customer_name?: StringNullableWithAggregatesFilter<"identity_verifications"> | string | null
    customer_phone?: StringNullableWithAggregatesFilter<"identity_verifications"> | string | null
    customer_email?: StringNullableWithAggregatesFilter<"identity_verifications"> | string | null
    ci?: StringNullableWithAggregatesFilter<"identity_verifications"> | string | null
    di?: StringNullableWithAggregatesFilter<"identity_verifications"> | string | null
    custom_data?: StringNullableWithAggregatesFilter<"identity_verifications"> | string | null
    requested_at?: DateTimeWithAggregatesFilter<"identity_verifications"> | Date | string
    status_changed_at?: DateTimeWithAggregatesFilter<"identity_verifications"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"identity_verifications"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"identity_verifications"> | Date | string
  }

  export type benefit_offersWhereInput = {
    AND?: benefit_offersWhereInput | benefit_offersWhereInput[]
    OR?: benefit_offersWhereInput[]
    NOT?: benefit_offersWhereInput | benefit_offersWhereInput[]
    id?: BigIntFilter<"benefit_offers"> | bigint | number
    provider_name?: StringFilter<"benefit_offers"> | string
    payment_type?: EnumPaymentTypeNullableFilter<"benefit_offers"> | $Enums.PaymentType | null
    title?: StringFilter<"benefit_offers"> | string
    description?: StringNullableFilter<"benefit_offers"> | string | null
    merchant_filter?: StringNullableFilter<"benefit_offers"> | string | null
    category_filter?: StringNullableFilter<"benefit_offers"> | string | null
    min_spend?: DecimalNullableFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string | null
    discount_type?: EnumDiscountTypeFilter<"benefit_offers"> | $Enums.DiscountType
    discount_value?: DecimalFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string
    max_discount?: DecimalNullableFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string | null
    start_date?: DateTimeNullableFilter<"benefit_offers"> | Date | string | null
    end_date?: DateTimeNullableFilter<"benefit_offers"> | Date | string | null
    active?: BoolFilter<"benefit_offers"> | boolean
    source_url?: StringNullableFilter<"benefit_offers"> | string | null
    hash?: StringNullableFilter<"benefit_offers"> | string | null
    created_at?: DateTimeFilter<"benefit_offers"> | Date | string
    updated_at?: DateTimeFilter<"benefit_offers"> | Date | string
  }

  export type benefit_offersOrderByWithRelationInput = {
    id?: SortOrder
    provider_name?: SortOrder
    payment_type?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    merchant_filter?: SortOrderInput | SortOrder
    category_filter?: SortOrderInput | SortOrder
    min_spend?: SortOrderInput | SortOrder
    discount_type?: SortOrder
    discount_value?: SortOrder
    max_discount?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    active?: SortOrder
    source_url?: SortOrderInput | SortOrder
    hash?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type benefit_offersWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    hash?: string
    AND?: benefit_offersWhereInput | benefit_offersWhereInput[]
    OR?: benefit_offersWhereInput[]
    NOT?: benefit_offersWhereInput | benefit_offersWhereInput[]
    provider_name?: StringFilter<"benefit_offers"> | string
    payment_type?: EnumPaymentTypeNullableFilter<"benefit_offers"> | $Enums.PaymentType | null
    title?: StringFilter<"benefit_offers"> | string
    description?: StringNullableFilter<"benefit_offers"> | string | null
    merchant_filter?: StringNullableFilter<"benefit_offers"> | string | null
    category_filter?: StringNullableFilter<"benefit_offers"> | string | null
    min_spend?: DecimalNullableFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string | null
    discount_type?: EnumDiscountTypeFilter<"benefit_offers"> | $Enums.DiscountType
    discount_value?: DecimalFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string
    max_discount?: DecimalNullableFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string | null
    start_date?: DateTimeNullableFilter<"benefit_offers"> | Date | string | null
    end_date?: DateTimeNullableFilter<"benefit_offers"> | Date | string | null
    active?: BoolFilter<"benefit_offers"> | boolean
    source_url?: StringNullableFilter<"benefit_offers"> | string | null
    created_at?: DateTimeFilter<"benefit_offers"> | Date | string
    updated_at?: DateTimeFilter<"benefit_offers"> | Date | string
  }, "id" | "hash">

  export type benefit_offersOrderByWithAggregationInput = {
    id?: SortOrder
    provider_name?: SortOrder
    payment_type?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    merchant_filter?: SortOrderInput | SortOrder
    category_filter?: SortOrderInput | SortOrder
    min_spend?: SortOrderInput | SortOrder
    discount_type?: SortOrder
    discount_value?: SortOrder
    max_discount?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    active?: SortOrder
    source_url?: SortOrderInput | SortOrder
    hash?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: benefit_offersCountOrderByAggregateInput
    _avg?: benefit_offersAvgOrderByAggregateInput
    _max?: benefit_offersMaxOrderByAggregateInput
    _min?: benefit_offersMinOrderByAggregateInput
    _sum?: benefit_offersSumOrderByAggregateInput
  }

  export type benefit_offersScalarWhereWithAggregatesInput = {
    AND?: benefit_offersScalarWhereWithAggregatesInput | benefit_offersScalarWhereWithAggregatesInput[]
    OR?: benefit_offersScalarWhereWithAggregatesInput[]
    NOT?: benefit_offersScalarWhereWithAggregatesInput | benefit_offersScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"benefit_offers"> | bigint | number
    provider_name?: StringWithAggregatesFilter<"benefit_offers"> | string
    payment_type?: EnumPaymentTypeNullableWithAggregatesFilter<"benefit_offers"> | $Enums.PaymentType | null
    title?: StringWithAggregatesFilter<"benefit_offers"> | string
    description?: StringNullableWithAggregatesFilter<"benefit_offers"> | string | null
    merchant_filter?: StringNullableWithAggregatesFilter<"benefit_offers"> | string | null
    category_filter?: StringNullableWithAggregatesFilter<"benefit_offers"> | string | null
    min_spend?: DecimalNullableWithAggregatesFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string | null
    discount_type?: EnumDiscountTypeWithAggregatesFilter<"benefit_offers"> | $Enums.DiscountType
    discount_value?: DecimalWithAggregatesFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string
    max_discount?: DecimalNullableWithAggregatesFilter<"benefit_offers"> | Decimal | DecimalJsLike | number | string | null
    start_date?: DateTimeNullableWithAggregatesFilter<"benefit_offers"> | Date | string | null
    end_date?: DateTimeNullableWithAggregatesFilter<"benefit_offers"> | Date | string | null
    active?: BoolWithAggregatesFilter<"benefit_offers"> | boolean
    source_url?: StringNullableWithAggregatesFilter<"benefit_offers"> | string | null
    hash?: StringNullableWithAggregatesFilter<"benefit_offers"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"benefit_offers"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"benefit_offers"> | Date | string
  }

  export type usersCreateInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUserInput
    user_settings?: user_settingsCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsUncheckedCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUserInput
    user_settings?: user_settingsUncheckedCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsUncheckedCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUncheckedUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUncheckedUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUncheckedUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type usersCreateManyInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type usersUpdateManyMutationInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersUncheckedUpdateManyInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_methodsCreateInput = {
    seq?: bigint | number
    type: $Enums.PaymentType
    card_number_hash?: string | null
    last_4_nums: string
    card_holder_name?: string | null
    provider_name: string
    card_brand?: string | null
    expiry_month?: string | null
    expiry_year?: string | null
    cvv_hash?: string | null
    billing_address?: string | null
    billing_zip?: string | null
    alias?: string | null
    is_primary?: boolean
    billing_key_id?: string | null
    billing_key_status?: string | null
    operator?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: usersCreateNestedOneWithoutPayment_methodsInput
  }

  export type payment_methodsUncheckedCreateInput = {
    seq?: bigint | number
    user_uuid: string
    type: $Enums.PaymentType
    card_number_hash?: string | null
    last_4_nums: string
    card_holder_name?: string | null
    provider_name: string
    card_brand?: string | null
    expiry_month?: string | null
    expiry_year?: string | null
    cvv_hash?: string | null
    billing_address?: string | null
    billing_zip?: string | null
    alias?: string | null
    is_primary?: boolean
    billing_key_id?: string | null
    billing_key_status?: string | null
    operator?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_methodsUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    card_number_hash?: NullableStringFieldUpdateOperationsInput | string | null
    last_4_nums?: StringFieldUpdateOperationsInput | string
    card_holder_name?: NullableStringFieldUpdateOperationsInput | string | null
    provider_name?: StringFieldUpdateOperationsInput | string
    card_brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_month?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_year?: NullableStringFieldUpdateOperationsInput | string | null
    cvv_hash?: NullableStringFieldUpdateOperationsInput | string | null
    billing_address?: NullableStringFieldUpdateOperationsInput | string | null
    billing_zip?: NullableStringFieldUpdateOperationsInput | string | null
    alias?: NullableStringFieldUpdateOperationsInput | string | null
    is_primary?: BoolFieldUpdateOperationsInput | boolean
    billing_key_id?: NullableStringFieldUpdateOperationsInput | string | null
    billing_key_status?: NullableStringFieldUpdateOperationsInput | string | null
    operator?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutPayment_methodsNestedInput
  }

  export type payment_methodsUncheckedUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    card_number_hash?: NullableStringFieldUpdateOperationsInput | string | null
    last_4_nums?: StringFieldUpdateOperationsInput | string
    card_holder_name?: NullableStringFieldUpdateOperationsInput | string | null
    provider_name?: StringFieldUpdateOperationsInput | string
    card_brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_month?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_year?: NullableStringFieldUpdateOperationsInput | string | null
    cvv_hash?: NullableStringFieldUpdateOperationsInput | string | null
    billing_address?: NullableStringFieldUpdateOperationsInput | string | null
    billing_zip?: NullableStringFieldUpdateOperationsInput | string | null
    alias?: NullableStringFieldUpdateOperationsInput | string | null
    is_primary?: BoolFieldUpdateOperationsInput | boolean
    billing_key_id?: NullableStringFieldUpdateOperationsInput | string | null
    billing_key_status?: NullableStringFieldUpdateOperationsInput | string | null
    operator?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_methodsCreateManyInput = {
    seq?: bigint | number
    user_uuid: string
    type: $Enums.PaymentType
    card_number_hash?: string | null
    last_4_nums: string
    card_holder_name?: string | null
    provider_name: string
    card_brand?: string | null
    expiry_month?: string | null
    expiry_year?: string | null
    cvv_hash?: string | null
    billing_address?: string | null
    billing_zip?: string | null
    alias?: string | null
    is_primary?: boolean
    billing_key_id?: string | null
    billing_key_status?: string | null
    operator?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_methodsUpdateManyMutationInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    card_number_hash?: NullableStringFieldUpdateOperationsInput | string | null
    last_4_nums?: StringFieldUpdateOperationsInput | string
    card_holder_name?: NullableStringFieldUpdateOperationsInput | string | null
    provider_name?: StringFieldUpdateOperationsInput | string
    card_brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_month?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_year?: NullableStringFieldUpdateOperationsInput | string | null
    cvv_hash?: NullableStringFieldUpdateOperationsInput | string | null
    billing_address?: NullableStringFieldUpdateOperationsInput | string | null
    billing_zip?: NullableStringFieldUpdateOperationsInput | string | null
    alias?: NullableStringFieldUpdateOperationsInput | string | null
    is_primary?: BoolFieldUpdateOperationsInput | boolean
    billing_key_id?: NullableStringFieldUpdateOperationsInput | string | null
    billing_key_status?: NullableStringFieldUpdateOperationsInput | string | null
    operator?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_methodsUncheckedUpdateManyInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    card_number_hash?: NullableStringFieldUpdateOperationsInput | string | null
    last_4_nums?: StringFieldUpdateOperationsInput | string
    card_holder_name?: NullableStringFieldUpdateOperationsInput | string | null
    provider_name?: StringFieldUpdateOperationsInput | string
    card_brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_month?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_year?: NullableStringFieldUpdateOperationsInput | string | null
    cvv_hash?: NullableStringFieldUpdateOperationsInput | string | null
    billing_address?: NullableStringFieldUpdateOperationsInput | string | null
    billing_zip?: NullableStringFieldUpdateOperationsInput | string | null
    alias?: NullableStringFieldUpdateOperationsInput | string | null
    is_primary?: BoolFieldUpdateOperationsInput | boolean
    billing_key_id?: NullableStringFieldUpdateOperationsInput | string | null
    billing_key_status?: NullableStringFieldUpdateOperationsInput | string | null
    operator?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsCreateInput = {
    seq?: bigint | number
    access_token: string
    refresh_token: string
    expires_at: Date | string
    device_info?: string | null
    created_at?: Date | string
    user: usersCreateNestedOneWithoutUser_sessionsInput
  }

  export type user_sessionsUncheckedCreateInput = {
    seq?: bigint | number
    user_seq: bigint | number
    access_token: string
    refresh_token: string
    expires_at: Date | string
    device_info?: string | null
    created_at?: Date | string
  }

  export type user_sessionsUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device_info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutUser_sessionsNestedInput
  }

  export type user_sessionsUncheckedUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    user_seq?: BigIntFieldUpdateOperationsInput | bigint | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device_info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsCreateManyInput = {
    seq?: bigint | number
    user_seq: bigint | number
    access_token: string
    refresh_token: string
    expires_at: Date | string
    device_info?: string | null
    created_at?: Date | string
  }

  export type user_sessionsUpdateManyMutationInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device_info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsUncheckedUpdateManyInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    user_seq?: BigIntFieldUpdateOperationsInput | bigint | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device_info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_settingsCreateInput = {
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: string
    currency_preference?: string
    updated_at?: Date | string
    user: usersCreateNestedOneWithoutUser_settingsInput
  }

  export type user_settingsUncheckedCreateInput = {
    user_seq: bigint | number
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: string
    currency_preference?: string
    updated_at?: Date | string
  }

  export type user_settingsUpdateInput = {
    dark_mode?: BoolFieldUpdateOperationsInput | boolean
    notification_enabled?: BoolFieldUpdateOperationsInput | boolean
    compare_mode?: StringFieldUpdateOperationsInput | string
    currency_preference?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutUser_settingsNestedInput
  }

  export type user_settingsUncheckedUpdateInput = {
    user_seq?: BigIntFieldUpdateOperationsInput | bigint | number
    dark_mode?: BoolFieldUpdateOperationsInput | boolean
    notification_enabled?: BoolFieldUpdateOperationsInput | boolean
    compare_mode?: StringFieldUpdateOperationsInput | string
    currency_preference?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_settingsCreateManyInput = {
    user_seq: bigint | number
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: string
    currency_preference?: string
    updated_at?: Date | string
  }

  export type user_settingsUpdateManyMutationInput = {
    dark_mode?: BoolFieldUpdateOperationsInput | boolean
    notification_enabled?: BoolFieldUpdateOperationsInput | boolean
    compare_mode?: StringFieldUpdateOperationsInput | string
    currency_preference?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_settingsUncheckedUpdateManyInput = {
    user_seq?: BigIntFieldUpdateOperationsInput | bigint | number
    dark_mode?: BoolFieldUpdateOperationsInput | boolean
    notification_enabled?: BoolFieldUpdateOperationsInput | boolean
    compare_mode?: StringFieldUpdateOperationsInput | string
    currency_preference?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_transactionsCreateInput = {
    seq?: bigint | number
    uuid: string
    payment_method_seq?: bigint | number | null
    merchant_name: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    benefit_value?: Decimal | DecimalJsLike | number | string | null
    benefit_desc?: string | null
    compared_at?: Date | string | null
    portone_payment_id?: string | null
    portone_transaction_id?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    user: usersCreateNestedOneWithoutPayment_transactionsInput
  }

  export type payment_transactionsUncheckedCreateInput = {
    seq?: bigint | number
    uuid: string
    user_uuid: string
    payment_method_seq?: bigint | number | null
    merchant_name: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    benefit_value?: Decimal | DecimalJsLike | number | string | null
    benefit_desc?: string | null
    compared_at?: Date | string | null
    portone_payment_id?: string | null
    portone_transaction_id?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_transactionsUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    payment_method_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    merchant_name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    benefit_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: NullableStringFieldUpdateOperationsInput | string | null
    compared_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    portone_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    portone_transaction_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutPayment_transactionsNestedInput
  }

  export type payment_transactionsUncheckedUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    payment_method_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    merchant_name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    benefit_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: NullableStringFieldUpdateOperationsInput | string | null
    compared_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    portone_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    portone_transaction_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_transactionsCreateManyInput = {
    seq?: bigint | number
    uuid: string
    user_uuid: string
    payment_method_seq?: bigint | number | null
    merchant_name: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    benefit_value?: Decimal | DecimalJsLike | number | string | null
    benefit_desc?: string | null
    compared_at?: Date | string | null
    portone_payment_id?: string | null
    portone_transaction_id?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_transactionsUpdateManyMutationInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    payment_method_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    merchant_name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    benefit_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: NullableStringFieldUpdateOperationsInput | string | null
    compared_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    portone_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    portone_transaction_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_transactionsUncheckedUpdateManyInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    payment_method_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    merchant_name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    benefit_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: NullableStringFieldUpdateOperationsInput | string | null
    compared_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    portone_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    portone_transaction_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type identity_verificationsCreateInput = {
    seq?: bigint | number
    uuid: string
    portone_id: string
    channel_key: string
    operator: string
    method: string
    status: string
    customer_name?: string | null
    customer_phone?: string | null
    customer_email?: string | null
    ci?: string | null
    di?: string | null
    custom_data?: string | null
    requested_at: Date | string
    status_changed_at: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    user: usersCreateNestedOneWithoutIdentity_verificationsInput
  }

  export type identity_verificationsUncheckedCreateInput = {
    seq?: bigint | number
    uuid: string
    user_uuid: string
    portone_id: string
    channel_key: string
    operator: string
    method: string
    status: string
    customer_name?: string | null
    customer_phone?: string | null
    customer_email?: string | null
    ci?: string | null
    di?: string | null
    custom_data?: string | null
    requested_at: Date | string
    status_changed_at: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type identity_verificationsUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    portone_id?: StringFieldUpdateOperationsInput | string
    channel_key?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    customer_name?: NullableStringFieldUpdateOperationsInput | string | null
    customer_phone?: NullableStringFieldUpdateOperationsInput | string | null
    customer_email?: NullableStringFieldUpdateOperationsInput | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    di?: NullableStringFieldUpdateOperationsInput | string | null
    custom_data?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status_changed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutIdentity_verificationsNestedInput
  }

  export type identity_verificationsUncheckedUpdateInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    portone_id?: StringFieldUpdateOperationsInput | string
    channel_key?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    customer_name?: NullableStringFieldUpdateOperationsInput | string | null
    customer_phone?: NullableStringFieldUpdateOperationsInput | string | null
    customer_email?: NullableStringFieldUpdateOperationsInput | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    di?: NullableStringFieldUpdateOperationsInput | string | null
    custom_data?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status_changed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type identity_verificationsCreateManyInput = {
    seq?: bigint | number
    uuid: string
    user_uuid: string
    portone_id: string
    channel_key: string
    operator: string
    method: string
    status: string
    customer_name?: string | null
    customer_phone?: string | null
    customer_email?: string | null
    ci?: string | null
    di?: string | null
    custom_data?: string | null
    requested_at: Date | string
    status_changed_at: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type identity_verificationsUpdateManyMutationInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    portone_id?: StringFieldUpdateOperationsInput | string
    channel_key?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    customer_name?: NullableStringFieldUpdateOperationsInput | string | null
    customer_phone?: NullableStringFieldUpdateOperationsInput | string | null
    customer_email?: NullableStringFieldUpdateOperationsInput | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    di?: NullableStringFieldUpdateOperationsInput | string | null
    custom_data?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status_changed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type identity_verificationsUncheckedUpdateManyInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    portone_id?: StringFieldUpdateOperationsInput | string
    channel_key?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    customer_name?: NullableStringFieldUpdateOperationsInput | string | null
    customer_phone?: NullableStringFieldUpdateOperationsInput | string | null
    customer_email?: NullableStringFieldUpdateOperationsInput | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    di?: NullableStringFieldUpdateOperationsInput | string | null
    custom_data?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status_changed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type benefit_offersCreateInput = {
    id?: bigint | number
    provider_name: string
    payment_type?: $Enums.PaymentType | null
    title: string
    description?: string | null
    merchant_filter?: string | null
    category_filter?: string | null
    min_spend?: Decimal | DecimalJsLike | number | string | null
    discount_type: $Enums.DiscountType
    discount_value: Decimal | DecimalJsLike | number | string
    max_discount?: Decimal | DecimalJsLike | number | string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    active?: boolean
    source_url?: string | null
    hash?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type benefit_offersUncheckedCreateInput = {
    id?: bigint | number
    provider_name: string
    payment_type?: $Enums.PaymentType | null
    title: string
    description?: string | null
    merchant_filter?: string | null
    category_filter?: string | null
    min_spend?: Decimal | DecimalJsLike | number | string | null
    discount_type: $Enums.DiscountType
    discount_value: Decimal | DecimalJsLike | number | string
    max_discount?: Decimal | DecimalJsLike | number | string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    active?: boolean
    source_url?: string | null
    hash?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type benefit_offersUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    provider_name?: StringFieldUpdateOperationsInput | string
    payment_type?: NullableEnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    merchant_filter?: NullableStringFieldUpdateOperationsInput | string | null
    category_filter?: NullableStringFieldUpdateOperationsInput | string | null
    min_spend?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount_type?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discount_value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    max_discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    source_url?: NullableStringFieldUpdateOperationsInput | string | null
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type benefit_offersUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    provider_name?: StringFieldUpdateOperationsInput | string
    payment_type?: NullableEnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    merchant_filter?: NullableStringFieldUpdateOperationsInput | string | null
    category_filter?: NullableStringFieldUpdateOperationsInput | string | null
    min_spend?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount_type?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discount_value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    max_discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    source_url?: NullableStringFieldUpdateOperationsInput | string | null
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type benefit_offersCreateManyInput = {
    id?: bigint | number
    provider_name: string
    payment_type?: $Enums.PaymentType | null
    title: string
    description?: string | null
    merchant_filter?: string | null
    category_filter?: string | null
    min_spend?: Decimal | DecimalJsLike | number | string | null
    discount_type: $Enums.DiscountType
    discount_value: Decimal | DecimalJsLike | number | string
    max_discount?: Decimal | DecimalJsLike | number | string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    active?: boolean
    source_url?: string | null
    hash?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type benefit_offersUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    provider_name?: StringFieldUpdateOperationsInput | string
    payment_type?: NullableEnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    merchant_filter?: NullableStringFieldUpdateOperationsInput | string | null
    category_filter?: NullableStringFieldUpdateOperationsInput | string | null
    min_spend?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount_type?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discount_value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    max_discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    source_url?: NullableStringFieldUpdateOperationsInput | string | null
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type benefit_offersUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    provider_name?: StringFieldUpdateOperationsInput | string
    payment_type?: NullableEnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    merchant_filter?: NullableStringFieldUpdateOperationsInput | string | null
    category_filter?: NullableStringFieldUpdateOperationsInput | string | null
    min_spend?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discount_type?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discount_value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    max_discount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    source_url?: NullableStringFieldUpdateOperationsInput | string | null
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type Payment_methodsListRelationFilter = {
    every?: payment_methodsWhereInput
    some?: payment_methodsWhereInput
    none?: payment_methodsWhereInput
  }

  export type User_sessionsListRelationFilter = {
    every?: user_sessionsWhereInput
    some?: user_sessionsWhereInput
    none?: user_sessionsWhereInput
  }

  export type User_settingsNullableScalarRelationFilter = {
    is?: user_settingsWhereInput | null
    isNot?: user_settingsWhereInput | null
  }

  export type Payment_transactionsListRelationFilter = {
    every?: payment_transactionsWhereInput
    some?: payment_transactionsWhereInput
    none?: payment_transactionsWhereInput
  }

  export type Identity_verificationsListRelationFilter = {
    every?: identity_verificationsWhereInput
    some?: identity_verificationsWhereInput
    none?: identity_verificationsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type payment_methodsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type user_sessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type payment_transactionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type identity_verificationsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    social_provider?: SortOrder
    social_id?: SortOrder
    name?: SortOrder
    preferred_payment_seq?: SortOrder
    is_verified?: SortOrder
    verified_at?: SortOrder
    ci?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    seq?: SortOrder
    preferred_payment_seq?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    social_provider?: SortOrder
    social_id?: SortOrder
    name?: SortOrder
    preferred_payment_seq?: SortOrder
    is_verified?: SortOrder
    verified_at?: SortOrder
    ci?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    social_provider?: SortOrder
    social_id?: SortOrder
    name?: SortOrder
    preferred_payment_seq?: SortOrder
    is_verified?: SortOrder
    verified_at?: SortOrder
    ci?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    seq?: SortOrder
    preferred_payment_seq?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumPaymentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeFilter<$PrismaModel> | $Enums.PaymentType
  }

  export type UsersScalarRelationFilter = {
    is?: usersWhereInput
    isNot?: usersWhereInput
  }

  export type payment_methodsCountOrderByAggregateInput = {
    seq?: SortOrder
    user_uuid?: SortOrder
    type?: SortOrder
    card_number_hash?: SortOrder
    last_4_nums?: SortOrder
    card_holder_name?: SortOrder
    provider_name?: SortOrder
    card_brand?: SortOrder
    expiry_month?: SortOrder
    expiry_year?: SortOrder
    cvv_hash?: SortOrder
    billing_address?: SortOrder
    billing_zip?: SortOrder
    alias?: SortOrder
    is_primary?: SortOrder
    billing_key_id?: SortOrder
    billing_key_status?: SortOrder
    operator?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type payment_methodsAvgOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type payment_methodsMaxOrderByAggregateInput = {
    seq?: SortOrder
    user_uuid?: SortOrder
    type?: SortOrder
    card_number_hash?: SortOrder
    last_4_nums?: SortOrder
    card_holder_name?: SortOrder
    provider_name?: SortOrder
    card_brand?: SortOrder
    expiry_month?: SortOrder
    expiry_year?: SortOrder
    cvv_hash?: SortOrder
    billing_address?: SortOrder
    billing_zip?: SortOrder
    alias?: SortOrder
    is_primary?: SortOrder
    billing_key_id?: SortOrder
    billing_key_status?: SortOrder
    operator?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type payment_methodsMinOrderByAggregateInput = {
    seq?: SortOrder
    user_uuid?: SortOrder
    type?: SortOrder
    card_number_hash?: SortOrder
    last_4_nums?: SortOrder
    card_holder_name?: SortOrder
    provider_name?: SortOrder
    card_brand?: SortOrder
    expiry_month?: SortOrder
    expiry_year?: SortOrder
    cvv_hash?: SortOrder
    billing_address?: SortOrder
    billing_zip?: SortOrder
    alias?: SortOrder
    is_primary?: SortOrder
    billing_key_id?: SortOrder
    billing_key_status?: SortOrder
    operator?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type payment_methodsSumOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type EnumPaymentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeFilter<$PrismaModel>
  }

  export type user_sessionsCountOrderByAggregateInput = {
    seq?: SortOrder
    user_seq?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires_at?: SortOrder
    device_info?: SortOrder
    created_at?: SortOrder
  }

  export type user_sessionsAvgOrderByAggregateInput = {
    seq?: SortOrder
    user_seq?: SortOrder
  }

  export type user_sessionsMaxOrderByAggregateInput = {
    seq?: SortOrder
    user_seq?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires_at?: SortOrder
    device_info?: SortOrder
    created_at?: SortOrder
  }

  export type user_sessionsMinOrderByAggregateInput = {
    seq?: SortOrder
    user_seq?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expires_at?: SortOrder
    device_info?: SortOrder
    created_at?: SortOrder
  }

  export type user_sessionsSumOrderByAggregateInput = {
    seq?: SortOrder
    user_seq?: SortOrder
  }

  export type user_settingsCountOrderByAggregateInput = {
    user_seq?: SortOrder
    dark_mode?: SortOrder
    notification_enabled?: SortOrder
    compare_mode?: SortOrder
    currency_preference?: SortOrder
    updated_at?: SortOrder
  }

  export type user_settingsAvgOrderByAggregateInput = {
    user_seq?: SortOrder
  }

  export type user_settingsMaxOrderByAggregateInput = {
    user_seq?: SortOrder
    dark_mode?: SortOrder
    notification_enabled?: SortOrder
    compare_mode?: SortOrder
    currency_preference?: SortOrder
    updated_at?: SortOrder
  }

  export type user_settingsMinOrderByAggregateInput = {
    user_seq?: SortOrder
    dark_mode?: SortOrder
    notification_enabled?: SortOrder
    compare_mode?: SortOrder
    currency_preference?: SortOrder
    updated_at?: SortOrder
  }

  export type user_settingsSumOrderByAggregateInput = {
    user_seq?: SortOrder
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type payment_transactionsCountOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    payment_method_seq?: SortOrder
    merchant_name?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    benefit_value?: SortOrder
    benefit_desc?: SortOrder
    compared_at?: SortOrder
    portone_payment_id?: SortOrder
    portone_transaction_id?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type payment_transactionsAvgOrderByAggregateInput = {
    seq?: SortOrder
    payment_method_seq?: SortOrder
    amount?: SortOrder
    benefit_value?: SortOrder
  }

  export type payment_transactionsMaxOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    payment_method_seq?: SortOrder
    merchant_name?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    benefit_value?: SortOrder
    benefit_desc?: SortOrder
    compared_at?: SortOrder
    portone_payment_id?: SortOrder
    portone_transaction_id?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type payment_transactionsMinOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    payment_method_seq?: SortOrder
    merchant_name?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    benefit_value?: SortOrder
    benefit_desc?: SortOrder
    compared_at?: SortOrder
    portone_payment_id?: SortOrder
    portone_transaction_id?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type payment_transactionsSumOrderByAggregateInput = {
    seq?: SortOrder
    payment_method_seq?: SortOrder
    amount?: SortOrder
    benefit_value?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type identity_verificationsCountOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    portone_id?: SortOrder
    channel_key?: SortOrder
    operator?: SortOrder
    method?: SortOrder
    status?: SortOrder
    customer_name?: SortOrder
    customer_phone?: SortOrder
    customer_email?: SortOrder
    ci?: SortOrder
    di?: SortOrder
    custom_data?: SortOrder
    requested_at?: SortOrder
    status_changed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type identity_verificationsAvgOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type identity_verificationsMaxOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    portone_id?: SortOrder
    channel_key?: SortOrder
    operator?: SortOrder
    method?: SortOrder
    status?: SortOrder
    customer_name?: SortOrder
    customer_phone?: SortOrder
    customer_email?: SortOrder
    ci?: SortOrder
    di?: SortOrder
    custom_data?: SortOrder
    requested_at?: SortOrder
    status_changed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type identity_verificationsMinOrderByAggregateInput = {
    seq?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    portone_id?: SortOrder
    channel_key?: SortOrder
    operator?: SortOrder
    method?: SortOrder
    status?: SortOrder
    customer_name?: SortOrder
    customer_phone?: SortOrder
    customer_email?: SortOrder
    ci?: SortOrder
    di?: SortOrder
    custom_data?: SortOrder
    requested_at?: SortOrder
    status_changed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type identity_verificationsSumOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type EnumPaymentTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentTypeNullableFilter<$PrismaModel> | $Enums.PaymentType | null
  }

  export type EnumDiscountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeFilter<$PrismaModel> | $Enums.DiscountType
  }

  export type benefit_offersCountOrderByAggregateInput = {
    id?: SortOrder
    provider_name?: SortOrder
    payment_type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    merchant_filter?: SortOrder
    category_filter?: SortOrder
    min_spend?: SortOrder
    discount_type?: SortOrder
    discount_value?: SortOrder
    max_discount?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    active?: SortOrder
    source_url?: SortOrder
    hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type benefit_offersAvgOrderByAggregateInput = {
    id?: SortOrder
    min_spend?: SortOrder
    discount_value?: SortOrder
    max_discount?: SortOrder
  }

  export type benefit_offersMaxOrderByAggregateInput = {
    id?: SortOrder
    provider_name?: SortOrder
    payment_type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    merchant_filter?: SortOrder
    category_filter?: SortOrder
    min_spend?: SortOrder
    discount_type?: SortOrder
    discount_value?: SortOrder
    max_discount?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    active?: SortOrder
    source_url?: SortOrder
    hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type benefit_offersMinOrderByAggregateInput = {
    id?: SortOrder
    provider_name?: SortOrder
    payment_type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    merchant_filter?: SortOrder
    category_filter?: SortOrder
    min_spend?: SortOrder
    discount_type?: SortOrder
    discount_value?: SortOrder
    max_discount?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    active?: SortOrder
    source_url?: SortOrder
    hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type benefit_offersSumOrderByAggregateInput = {
    id?: SortOrder
    min_spend?: SortOrder
    discount_value?: SortOrder
    max_discount?: SortOrder
  }

  export type EnumPaymentTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeNullableFilter<$PrismaModel>
  }

  export type EnumDiscountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiscountTypeFilter<$PrismaModel>
    _max?: NestedEnumDiscountTypeFilter<$PrismaModel>
  }

  export type payment_methodsCreateNestedManyWithoutUserInput = {
    create?: XOR<payment_methodsCreateWithoutUserInput, payment_methodsUncheckedCreateWithoutUserInput> | payment_methodsCreateWithoutUserInput[] | payment_methodsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_methodsCreateOrConnectWithoutUserInput | payment_methodsCreateOrConnectWithoutUserInput[]
    createMany?: payment_methodsCreateManyUserInputEnvelope
    connect?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
  }

  export type user_sessionsCreateNestedManyWithoutUserInput = {
    create?: XOR<user_sessionsCreateWithoutUserInput, user_sessionsUncheckedCreateWithoutUserInput> | user_sessionsCreateWithoutUserInput[] | user_sessionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: user_sessionsCreateOrConnectWithoutUserInput | user_sessionsCreateOrConnectWithoutUserInput[]
    createMany?: user_sessionsCreateManyUserInputEnvelope
    connect?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
  }

  export type user_settingsCreateNestedOneWithoutUserInput = {
    create?: XOR<user_settingsCreateWithoutUserInput, user_settingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_settingsCreateOrConnectWithoutUserInput
    connect?: user_settingsWhereUniqueInput
  }

  export type payment_transactionsCreateNestedManyWithoutUserInput = {
    create?: XOR<payment_transactionsCreateWithoutUserInput, payment_transactionsUncheckedCreateWithoutUserInput> | payment_transactionsCreateWithoutUserInput[] | payment_transactionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_transactionsCreateOrConnectWithoutUserInput | payment_transactionsCreateOrConnectWithoutUserInput[]
    createMany?: payment_transactionsCreateManyUserInputEnvelope
    connect?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
  }

  export type identity_verificationsCreateNestedManyWithoutUserInput = {
    create?: XOR<identity_verificationsCreateWithoutUserInput, identity_verificationsUncheckedCreateWithoutUserInput> | identity_verificationsCreateWithoutUserInput[] | identity_verificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: identity_verificationsCreateOrConnectWithoutUserInput | identity_verificationsCreateOrConnectWithoutUserInput[]
    createMany?: identity_verificationsCreateManyUserInputEnvelope
    connect?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
  }

  export type payment_methodsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<payment_methodsCreateWithoutUserInput, payment_methodsUncheckedCreateWithoutUserInput> | payment_methodsCreateWithoutUserInput[] | payment_methodsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_methodsCreateOrConnectWithoutUserInput | payment_methodsCreateOrConnectWithoutUserInput[]
    createMany?: payment_methodsCreateManyUserInputEnvelope
    connect?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
  }

  export type user_sessionsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<user_sessionsCreateWithoutUserInput, user_sessionsUncheckedCreateWithoutUserInput> | user_sessionsCreateWithoutUserInput[] | user_sessionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: user_sessionsCreateOrConnectWithoutUserInput | user_sessionsCreateOrConnectWithoutUserInput[]
    createMany?: user_sessionsCreateManyUserInputEnvelope
    connect?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
  }

  export type user_settingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<user_settingsCreateWithoutUserInput, user_settingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_settingsCreateOrConnectWithoutUserInput
    connect?: user_settingsWhereUniqueInput
  }

  export type payment_transactionsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<payment_transactionsCreateWithoutUserInput, payment_transactionsUncheckedCreateWithoutUserInput> | payment_transactionsCreateWithoutUserInput[] | payment_transactionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_transactionsCreateOrConnectWithoutUserInput | payment_transactionsCreateOrConnectWithoutUserInput[]
    createMany?: payment_transactionsCreateManyUserInputEnvelope
    connect?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
  }

  export type identity_verificationsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<identity_verificationsCreateWithoutUserInput, identity_verificationsUncheckedCreateWithoutUserInput> | identity_verificationsCreateWithoutUserInput[] | identity_verificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: identity_verificationsCreateOrConnectWithoutUserInput | identity_verificationsCreateOrConnectWithoutUserInput[]
    createMany?: identity_verificationsCreateManyUserInputEnvelope
    connect?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type payment_methodsUpdateManyWithoutUserNestedInput = {
    create?: XOR<payment_methodsCreateWithoutUserInput, payment_methodsUncheckedCreateWithoutUserInput> | payment_methodsCreateWithoutUserInput[] | payment_methodsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_methodsCreateOrConnectWithoutUserInput | payment_methodsCreateOrConnectWithoutUserInput[]
    upsert?: payment_methodsUpsertWithWhereUniqueWithoutUserInput | payment_methodsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: payment_methodsCreateManyUserInputEnvelope
    set?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    disconnect?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    delete?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    connect?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    update?: payment_methodsUpdateWithWhereUniqueWithoutUserInput | payment_methodsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: payment_methodsUpdateManyWithWhereWithoutUserInput | payment_methodsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: payment_methodsScalarWhereInput | payment_methodsScalarWhereInput[]
  }

  export type user_sessionsUpdateManyWithoutUserNestedInput = {
    create?: XOR<user_sessionsCreateWithoutUserInput, user_sessionsUncheckedCreateWithoutUserInput> | user_sessionsCreateWithoutUserInput[] | user_sessionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: user_sessionsCreateOrConnectWithoutUserInput | user_sessionsCreateOrConnectWithoutUserInput[]
    upsert?: user_sessionsUpsertWithWhereUniqueWithoutUserInput | user_sessionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: user_sessionsCreateManyUserInputEnvelope
    set?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    disconnect?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    delete?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    connect?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    update?: user_sessionsUpdateWithWhereUniqueWithoutUserInput | user_sessionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: user_sessionsUpdateManyWithWhereWithoutUserInput | user_sessionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: user_sessionsScalarWhereInput | user_sessionsScalarWhereInput[]
  }

  export type user_settingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<user_settingsCreateWithoutUserInput, user_settingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_settingsCreateOrConnectWithoutUserInput
    upsert?: user_settingsUpsertWithoutUserInput
    disconnect?: user_settingsWhereInput | boolean
    delete?: user_settingsWhereInput | boolean
    connect?: user_settingsWhereUniqueInput
    update?: XOR<XOR<user_settingsUpdateToOneWithWhereWithoutUserInput, user_settingsUpdateWithoutUserInput>, user_settingsUncheckedUpdateWithoutUserInput>
  }

  export type payment_transactionsUpdateManyWithoutUserNestedInput = {
    create?: XOR<payment_transactionsCreateWithoutUserInput, payment_transactionsUncheckedCreateWithoutUserInput> | payment_transactionsCreateWithoutUserInput[] | payment_transactionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_transactionsCreateOrConnectWithoutUserInput | payment_transactionsCreateOrConnectWithoutUserInput[]
    upsert?: payment_transactionsUpsertWithWhereUniqueWithoutUserInput | payment_transactionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: payment_transactionsCreateManyUserInputEnvelope
    set?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    disconnect?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    delete?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    connect?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    update?: payment_transactionsUpdateWithWhereUniqueWithoutUserInput | payment_transactionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: payment_transactionsUpdateManyWithWhereWithoutUserInput | payment_transactionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: payment_transactionsScalarWhereInput | payment_transactionsScalarWhereInput[]
  }

  export type identity_verificationsUpdateManyWithoutUserNestedInput = {
    create?: XOR<identity_verificationsCreateWithoutUserInput, identity_verificationsUncheckedCreateWithoutUserInput> | identity_verificationsCreateWithoutUserInput[] | identity_verificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: identity_verificationsCreateOrConnectWithoutUserInput | identity_verificationsCreateOrConnectWithoutUserInput[]
    upsert?: identity_verificationsUpsertWithWhereUniqueWithoutUserInput | identity_verificationsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: identity_verificationsCreateManyUserInputEnvelope
    set?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    disconnect?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    delete?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    connect?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    update?: identity_verificationsUpdateWithWhereUniqueWithoutUserInput | identity_verificationsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: identity_verificationsUpdateManyWithWhereWithoutUserInput | identity_verificationsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: identity_verificationsScalarWhereInput | identity_verificationsScalarWhereInput[]
  }

  export type payment_methodsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<payment_methodsCreateWithoutUserInput, payment_methodsUncheckedCreateWithoutUserInput> | payment_methodsCreateWithoutUserInput[] | payment_methodsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_methodsCreateOrConnectWithoutUserInput | payment_methodsCreateOrConnectWithoutUserInput[]
    upsert?: payment_methodsUpsertWithWhereUniqueWithoutUserInput | payment_methodsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: payment_methodsCreateManyUserInputEnvelope
    set?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    disconnect?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    delete?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    connect?: payment_methodsWhereUniqueInput | payment_methodsWhereUniqueInput[]
    update?: payment_methodsUpdateWithWhereUniqueWithoutUserInput | payment_methodsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: payment_methodsUpdateManyWithWhereWithoutUserInput | payment_methodsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: payment_methodsScalarWhereInput | payment_methodsScalarWhereInput[]
  }

  export type user_sessionsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<user_sessionsCreateWithoutUserInput, user_sessionsUncheckedCreateWithoutUserInput> | user_sessionsCreateWithoutUserInput[] | user_sessionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: user_sessionsCreateOrConnectWithoutUserInput | user_sessionsCreateOrConnectWithoutUserInput[]
    upsert?: user_sessionsUpsertWithWhereUniqueWithoutUserInput | user_sessionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: user_sessionsCreateManyUserInputEnvelope
    set?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    disconnect?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    delete?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    connect?: user_sessionsWhereUniqueInput | user_sessionsWhereUniqueInput[]
    update?: user_sessionsUpdateWithWhereUniqueWithoutUserInput | user_sessionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: user_sessionsUpdateManyWithWhereWithoutUserInput | user_sessionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: user_sessionsScalarWhereInput | user_sessionsScalarWhereInput[]
  }

  export type user_settingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<user_settingsCreateWithoutUserInput, user_settingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_settingsCreateOrConnectWithoutUserInput
    upsert?: user_settingsUpsertWithoutUserInput
    disconnect?: user_settingsWhereInput | boolean
    delete?: user_settingsWhereInput | boolean
    connect?: user_settingsWhereUniqueInput
    update?: XOR<XOR<user_settingsUpdateToOneWithWhereWithoutUserInput, user_settingsUpdateWithoutUserInput>, user_settingsUncheckedUpdateWithoutUserInput>
  }

  export type payment_transactionsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<payment_transactionsCreateWithoutUserInput, payment_transactionsUncheckedCreateWithoutUserInput> | payment_transactionsCreateWithoutUserInput[] | payment_transactionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: payment_transactionsCreateOrConnectWithoutUserInput | payment_transactionsCreateOrConnectWithoutUserInput[]
    upsert?: payment_transactionsUpsertWithWhereUniqueWithoutUserInput | payment_transactionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: payment_transactionsCreateManyUserInputEnvelope
    set?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    disconnect?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    delete?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    connect?: payment_transactionsWhereUniqueInput | payment_transactionsWhereUniqueInput[]
    update?: payment_transactionsUpdateWithWhereUniqueWithoutUserInput | payment_transactionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: payment_transactionsUpdateManyWithWhereWithoutUserInput | payment_transactionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: payment_transactionsScalarWhereInput | payment_transactionsScalarWhereInput[]
  }

  export type identity_verificationsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<identity_verificationsCreateWithoutUserInput, identity_verificationsUncheckedCreateWithoutUserInput> | identity_verificationsCreateWithoutUserInput[] | identity_verificationsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: identity_verificationsCreateOrConnectWithoutUserInput | identity_verificationsCreateOrConnectWithoutUserInput[]
    upsert?: identity_verificationsUpsertWithWhereUniqueWithoutUserInput | identity_verificationsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: identity_verificationsCreateManyUserInputEnvelope
    set?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    disconnect?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    delete?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    connect?: identity_verificationsWhereUniqueInput | identity_verificationsWhereUniqueInput[]
    update?: identity_verificationsUpdateWithWhereUniqueWithoutUserInput | identity_verificationsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: identity_verificationsUpdateManyWithWhereWithoutUserInput | identity_verificationsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: identity_verificationsScalarWhereInput | identity_verificationsScalarWhereInput[]
  }

  export type usersCreateNestedOneWithoutPayment_methodsInput = {
    create?: XOR<usersCreateWithoutPayment_methodsInput, usersUncheckedCreateWithoutPayment_methodsInput>
    connectOrCreate?: usersCreateOrConnectWithoutPayment_methodsInput
    connect?: usersWhereUniqueInput
  }

  export type EnumPaymentTypeFieldUpdateOperationsInput = {
    set?: $Enums.PaymentType
  }

  export type usersUpdateOneRequiredWithoutPayment_methodsNestedInput = {
    create?: XOR<usersCreateWithoutPayment_methodsInput, usersUncheckedCreateWithoutPayment_methodsInput>
    connectOrCreate?: usersCreateOrConnectWithoutPayment_methodsInput
    upsert?: usersUpsertWithoutPayment_methodsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutPayment_methodsInput, usersUpdateWithoutPayment_methodsInput>, usersUncheckedUpdateWithoutPayment_methodsInput>
  }

  export type usersCreateNestedOneWithoutUser_sessionsInput = {
    create?: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_sessionsInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutUser_sessionsNestedInput = {
    create?: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_sessionsInput
    upsert?: usersUpsertWithoutUser_sessionsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutUser_sessionsInput, usersUpdateWithoutUser_sessionsInput>, usersUncheckedUpdateWithoutUser_sessionsInput>
  }

  export type usersCreateNestedOneWithoutUser_settingsInput = {
    create?: XOR<usersCreateWithoutUser_settingsInput, usersUncheckedCreateWithoutUser_settingsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_settingsInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutUser_settingsNestedInput = {
    create?: XOR<usersCreateWithoutUser_settingsInput, usersUncheckedCreateWithoutUser_settingsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_settingsInput
    upsert?: usersUpsertWithoutUser_settingsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutUser_settingsInput, usersUpdateWithoutUser_settingsInput>, usersUncheckedUpdateWithoutUser_settingsInput>
  }

  export type usersCreateNestedOneWithoutPayment_transactionsInput = {
    create?: XOR<usersCreateWithoutPayment_transactionsInput, usersUncheckedCreateWithoutPayment_transactionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutPayment_transactionsInput
    connect?: usersWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type usersUpdateOneRequiredWithoutPayment_transactionsNestedInput = {
    create?: XOR<usersCreateWithoutPayment_transactionsInput, usersUncheckedCreateWithoutPayment_transactionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutPayment_transactionsInput
    upsert?: usersUpsertWithoutPayment_transactionsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutPayment_transactionsInput, usersUpdateWithoutPayment_transactionsInput>, usersUncheckedUpdateWithoutPayment_transactionsInput>
  }

  export type usersCreateNestedOneWithoutIdentity_verificationsInput = {
    create?: XOR<usersCreateWithoutIdentity_verificationsInput, usersUncheckedCreateWithoutIdentity_verificationsInput>
    connectOrCreate?: usersCreateOrConnectWithoutIdentity_verificationsInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutIdentity_verificationsNestedInput = {
    create?: XOR<usersCreateWithoutIdentity_verificationsInput, usersUncheckedCreateWithoutIdentity_verificationsInput>
    connectOrCreate?: usersCreateOrConnectWithoutIdentity_verificationsInput
    upsert?: usersUpsertWithoutIdentity_verificationsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutIdentity_verificationsInput, usersUpdateWithoutIdentity_verificationsInput>, usersUncheckedUpdateWithoutIdentity_verificationsInput>
  }

  export type NullableEnumPaymentTypeFieldUpdateOperationsInput = {
    set?: $Enums.PaymentType | null
  }

  export type EnumDiscountTypeFieldUpdateOperationsInput = {
    set?: $Enums.DiscountType
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeFilter<$PrismaModel> | $Enums.PaymentType
  }

  export type NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumPaymentTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentTypeNullableFilter<$PrismaModel> | $Enums.PaymentType | null
  }

  export type NestedEnumDiscountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeFilter<$PrismaModel> | $Enums.DiscountType
  }

  export type NestedEnumPaymentTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiscountTypeFilter<$PrismaModel>
    _max?: NestedEnumDiscountTypeFilter<$PrismaModel>
  }

  export type payment_methodsCreateWithoutUserInput = {
    seq?: bigint | number
    type: $Enums.PaymentType
    card_number_hash?: string | null
    last_4_nums: string
    card_holder_name?: string | null
    provider_name: string
    card_brand?: string | null
    expiry_month?: string | null
    expiry_year?: string | null
    cvv_hash?: string | null
    billing_address?: string | null
    billing_zip?: string | null
    alias?: string | null
    is_primary?: boolean
    billing_key_id?: string | null
    billing_key_status?: string | null
    operator?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_methodsUncheckedCreateWithoutUserInput = {
    seq?: bigint | number
    type: $Enums.PaymentType
    card_number_hash?: string | null
    last_4_nums: string
    card_holder_name?: string | null
    provider_name: string
    card_brand?: string | null
    expiry_month?: string | null
    expiry_year?: string | null
    cvv_hash?: string | null
    billing_address?: string | null
    billing_zip?: string | null
    alias?: string | null
    is_primary?: boolean
    billing_key_id?: string | null
    billing_key_status?: string | null
    operator?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_methodsCreateOrConnectWithoutUserInput = {
    where: payment_methodsWhereUniqueInput
    create: XOR<payment_methodsCreateWithoutUserInput, payment_methodsUncheckedCreateWithoutUserInput>
  }

  export type payment_methodsCreateManyUserInputEnvelope = {
    data: payment_methodsCreateManyUserInput | payment_methodsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type user_sessionsCreateWithoutUserInput = {
    seq?: bigint | number
    access_token: string
    refresh_token: string
    expires_at: Date | string
    device_info?: string | null
    created_at?: Date | string
  }

  export type user_sessionsUncheckedCreateWithoutUserInput = {
    seq?: bigint | number
    access_token: string
    refresh_token: string
    expires_at: Date | string
    device_info?: string | null
    created_at?: Date | string
  }

  export type user_sessionsCreateOrConnectWithoutUserInput = {
    where: user_sessionsWhereUniqueInput
    create: XOR<user_sessionsCreateWithoutUserInput, user_sessionsUncheckedCreateWithoutUserInput>
  }

  export type user_sessionsCreateManyUserInputEnvelope = {
    data: user_sessionsCreateManyUserInput | user_sessionsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type user_settingsCreateWithoutUserInput = {
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: string
    currency_preference?: string
    updated_at?: Date | string
  }

  export type user_settingsUncheckedCreateWithoutUserInput = {
    dark_mode?: boolean
    notification_enabled?: boolean
    compare_mode?: string
    currency_preference?: string
    updated_at?: Date | string
  }

  export type user_settingsCreateOrConnectWithoutUserInput = {
    where: user_settingsWhereUniqueInput
    create: XOR<user_settingsCreateWithoutUserInput, user_settingsUncheckedCreateWithoutUserInput>
  }

  export type payment_transactionsCreateWithoutUserInput = {
    seq?: bigint | number
    uuid: string
    payment_method_seq?: bigint | number | null
    merchant_name: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    benefit_value?: Decimal | DecimalJsLike | number | string | null
    benefit_desc?: string | null
    compared_at?: Date | string | null
    portone_payment_id?: string | null
    portone_transaction_id?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_transactionsUncheckedCreateWithoutUserInput = {
    seq?: bigint | number
    uuid: string
    payment_method_seq?: bigint | number | null
    merchant_name: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    benefit_value?: Decimal | DecimalJsLike | number | string | null
    benefit_desc?: string | null
    compared_at?: Date | string | null
    portone_payment_id?: string | null
    portone_transaction_id?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_transactionsCreateOrConnectWithoutUserInput = {
    where: payment_transactionsWhereUniqueInput
    create: XOR<payment_transactionsCreateWithoutUserInput, payment_transactionsUncheckedCreateWithoutUserInput>
  }

  export type payment_transactionsCreateManyUserInputEnvelope = {
    data: payment_transactionsCreateManyUserInput | payment_transactionsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type identity_verificationsCreateWithoutUserInput = {
    seq?: bigint | number
    uuid: string
    portone_id: string
    channel_key: string
    operator: string
    method: string
    status: string
    customer_name?: string | null
    customer_phone?: string | null
    customer_email?: string | null
    ci?: string | null
    di?: string | null
    custom_data?: string | null
    requested_at: Date | string
    status_changed_at: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type identity_verificationsUncheckedCreateWithoutUserInput = {
    seq?: bigint | number
    uuid: string
    portone_id: string
    channel_key: string
    operator: string
    method: string
    status: string
    customer_name?: string | null
    customer_phone?: string | null
    customer_email?: string | null
    ci?: string | null
    di?: string | null
    custom_data?: string | null
    requested_at: Date | string
    status_changed_at: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type identity_verificationsCreateOrConnectWithoutUserInput = {
    where: identity_verificationsWhereUniqueInput
    create: XOR<identity_verificationsCreateWithoutUserInput, identity_verificationsUncheckedCreateWithoutUserInput>
  }

  export type identity_verificationsCreateManyUserInputEnvelope = {
    data: identity_verificationsCreateManyUserInput | identity_verificationsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type payment_methodsUpsertWithWhereUniqueWithoutUserInput = {
    where: payment_methodsWhereUniqueInput
    update: XOR<payment_methodsUpdateWithoutUserInput, payment_methodsUncheckedUpdateWithoutUserInput>
    create: XOR<payment_methodsCreateWithoutUserInput, payment_methodsUncheckedCreateWithoutUserInput>
  }

  export type payment_methodsUpdateWithWhereUniqueWithoutUserInput = {
    where: payment_methodsWhereUniqueInput
    data: XOR<payment_methodsUpdateWithoutUserInput, payment_methodsUncheckedUpdateWithoutUserInput>
  }

  export type payment_methodsUpdateManyWithWhereWithoutUserInput = {
    where: payment_methodsScalarWhereInput
    data: XOR<payment_methodsUpdateManyMutationInput, payment_methodsUncheckedUpdateManyWithoutUserInput>
  }

  export type payment_methodsScalarWhereInput = {
    AND?: payment_methodsScalarWhereInput | payment_methodsScalarWhereInput[]
    OR?: payment_methodsScalarWhereInput[]
    NOT?: payment_methodsScalarWhereInput | payment_methodsScalarWhereInput[]
    seq?: BigIntFilter<"payment_methods"> | bigint | number
    user_uuid?: StringFilter<"payment_methods"> | string
    type?: EnumPaymentTypeFilter<"payment_methods"> | $Enums.PaymentType
    card_number_hash?: StringNullableFilter<"payment_methods"> | string | null
    last_4_nums?: StringFilter<"payment_methods"> | string
    card_holder_name?: StringNullableFilter<"payment_methods"> | string | null
    provider_name?: StringFilter<"payment_methods"> | string
    card_brand?: StringNullableFilter<"payment_methods"> | string | null
    expiry_month?: StringNullableFilter<"payment_methods"> | string | null
    expiry_year?: StringNullableFilter<"payment_methods"> | string | null
    cvv_hash?: StringNullableFilter<"payment_methods"> | string | null
    billing_address?: StringNullableFilter<"payment_methods"> | string | null
    billing_zip?: StringNullableFilter<"payment_methods"> | string | null
    alias?: StringNullableFilter<"payment_methods"> | string | null
    is_primary?: BoolFilter<"payment_methods"> | boolean
    billing_key_id?: StringNullableFilter<"payment_methods"> | string | null
    billing_key_status?: StringNullableFilter<"payment_methods"> | string | null
    operator?: StringNullableFilter<"payment_methods"> | string | null
    created_at?: DateTimeFilter<"payment_methods"> | Date | string
    updated_at?: DateTimeFilter<"payment_methods"> | Date | string
  }

  export type user_sessionsUpsertWithWhereUniqueWithoutUserInput = {
    where: user_sessionsWhereUniqueInput
    update: XOR<user_sessionsUpdateWithoutUserInput, user_sessionsUncheckedUpdateWithoutUserInput>
    create: XOR<user_sessionsCreateWithoutUserInput, user_sessionsUncheckedCreateWithoutUserInput>
  }

  export type user_sessionsUpdateWithWhereUniqueWithoutUserInput = {
    where: user_sessionsWhereUniqueInput
    data: XOR<user_sessionsUpdateWithoutUserInput, user_sessionsUncheckedUpdateWithoutUserInput>
  }

  export type user_sessionsUpdateManyWithWhereWithoutUserInput = {
    where: user_sessionsScalarWhereInput
    data: XOR<user_sessionsUpdateManyMutationInput, user_sessionsUncheckedUpdateManyWithoutUserInput>
  }

  export type user_sessionsScalarWhereInput = {
    AND?: user_sessionsScalarWhereInput | user_sessionsScalarWhereInput[]
    OR?: user_sessionsScalarWhereInput[]
    NOT?: user_sessionsScalarWhereInput | user_sessionsScalarWhereInput[]
    seq?: BigIntFilter<"user_sessions"> | bigint | number
    user_seq?: BigIntFilter<"user_sessions"> | bigint | number
    access_token?: StringFilter<"user_sessions"> | string
    refresh_token?: StringFilter<"user_sessions"> | string
    expires_at?: DateTimeFilter<"user_sessions"> | Date | string
    device_info?: StringNullableFilter<"user_sessions"> | string | null
    created_at?: DateTimeFilter<"user_sessions"> | Date | string
  }

  export type user_settingsUpsertWithoutUserInput = {
    update: XOR<user_settingsUpdateWithoutUserInput, user_settingsUncheckedUpdateWithoutUserInput>
    create: XOR<user_settingsCreateWithoutUserInput, user_settingsUncheckedCreateWithoutUserInput>
    where?: user_settingsWhereInput
  }

  export type user_settingsUpdateToOneWithWhereWithoutUserInput = {
    where?: user_settingsWhereInput
    data: XOR<user_settingsUpdateWithoutUserInput, user_settingsUncheckedUpdateWithoutUserInput>
  }

  export type user_settingsUpdateWithoutUserInput = {
    dark_mode?: BoolFieldUpdateOperationsInput | boolean
    notification_enabled?: BoolFieldUpdateOperationsInput | boolean
    compare_mode?: StringFieldUpdateOperationsInput | string
    currency_preference?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_settingsUncheckedUpdateWithoutUserInput = {
    dark_mode?: BoolFieldUpdateOperationsInput | boolean
    notification_enabled?: BoolFieldUpdateOperationsInput | boolean
    compare_mode?: StringFieldUpdateOperationsInput | string
    currency_preference?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_transactionsUpsertWithWhereUniqueWithoutUserInput = {
    where: payment_transactionsWhereUniqueInput
    update: XOR<payment_transactionsUpdateWithoutUserInput, payment_transactionsUncheckedUpdateWithoutUserInput>
    create: XOR<payment_transactionsCreateWithoutUserInput, payment_transactionsUncheckedCreateWithoutUserInput>
  }

  export type payment_transactionsUpdateWithWhereUniqueWithoutUserInput = {
    where: payment_transactionsWhereUniqueInput
    data: XOR<payment_transactionsUpdateWithoutUserInput, payment_transactionsUncheckedUpdateWithoutUserInput>
  }

  export type payment_transactionsUpdateManyWithWhereWithoutUserInput = {
    where: payment_transactionsScalarWhereInput
    data: XOR<payment_transactionsUpdateManyMutationInput, payment_transactionsUncheckedUpdateManyWithoutUserInput>
  }

  export type payment_transactionsScalarWhereInput = {
    AND?: payment_transactionsScalarWhereInput | payment_transactionsScalarWhereInput[]
    OR?: payment_transactionsScalarWhereInput[]
    NOT?: payment_transactionsScalarWhereInput | payment_transactionsScalarWhereInput[]
    seq?: BigIntFilter<"payment_transactions"> | bigint | number
    uuid?: UuidFilter<"payment_transactions"> | string
    user_uuid?: StringFilter<"payment_transactions"> | string
    payment_method_seq?: BigIntNullableFilter<"payment_transactions"> | bigint | number | null
    merchant_name?: StringFilter<"payment_transactions"> | string
    amount?: DecimalFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"payment_transactions"> | string
    benefit_value?: DecimalNullableFilter<"payment_transactions"> | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: StringNullableFilter<"payment_transactions"> | string | null
    compared_at?: DateTimeNullableFilter<"payment_transactions"> | Date | string | null
    portone_payment_id?: StringNullableFilter<"payment_transactions"> | string | null
    portone_transaction_id?: StringNullableFilter<"payment_transactions"> | string | null
    status?: StringFilter<"payment_transactions"> | string
    created_at?: DateTimeFilter<"payment_transactions"> | Date | string
    updated_at?: DateTimeFilter<"payment_transactions"> | Date | string
  }

  export type identity_verificationsUpsertWithWhereUniqueWithoutUserInput = {
    where: identity_verificationsWhereUniqueInput
    update: XOR<identity_verificationsUpdateWithoutUserInput, identity_verificationsUncheckedUpdateWithoutUserInput>
    create: XOR<identity_verificationsCreateWithoutUserInput, identity_verificationsUncheckedCreateWithoutUserInput>
  }

  export type identity_verificationsUpdateWithWhereUniqueWithoutUserInput = {
    where: identity_verificationsWhereUniqueInput
    data: XOR<identity_verificationsUpdateWithoutUserInput, identity_verificationsUncheckedUpdateWithoutUserInput>
  }

  export type identity_verificationsUpdateManyWithWhereWithoutUserInput = {
    where: identity_verificationsScalarWhereInput
    data: XOR<identity_verificationsUpdateManyMutationInput, identity_verificationsUncheckedUpdateManyWithoutUserInput>
  }

  export type identity_verificationsScalarWhereInput = {
    AND?: identity_verificationsScalarWhereInput | identity_verificationsScalarWhereInput[]
    OR?: identity_verificationsScalarWhereInput[]
    NOT?: identity_verificationsScalarWhereInput | identity_verificationsScalarWhereInput[]
    seq?: BigIntFilter<"identity_verifications"> | bigint | number
    uuid?: UuidFilter<"identity_verifications"> | string
    user_uuid?: StringFilter<"identity_verifications"> | string
    portone_id?: StringFilter<"identity_verifications"> | string
    channel_key?: StringFilter<"identity_verifications"> | string
    operator?: StringFilter<"identity_verifications"> | string
    method?: StringFilter<"identity_verifications"> | string
    status?: StringFilter<"identity_verifications"> | string
    customer_name?: StringNullableFilter<"identity_verifications"> | string | null
    customer_phone?: StringNullableFilter<"identity_verifications"> | string | null
    customer_email?: StringNullableFilter<"identity_verifications"> | string | null
    ci?: StringNullableFilter<"identity_verifications"> | string | null
    di?: StringNullableFilter<"identity_verifications"> | string | null
    custom_data?: StringNullableFilter<"identity_verifications"> | string | null
    requested_at?: DateTimeFilter<"identity_verifications"> | Date | string
    status_changed_at?: DateTimeFilter<"identity_verifications"> | Date | string
    created_at?: DateTimeFilter<"identity_verifications"> | Date | string
    updated_at?: DateTimeFilter<"identity_verifications"> | Date | string
  }

  export type usersCreateWithoutPayment_methodsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_sessions?: user_sessionsCreateNestedManyWithoutUserInput
    user_settings?: user_settingsCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutPayment_methodsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUserInput
    user_settings?: user_settingsUncheckedCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsUncheckedCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutPayment_methodsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutPayment_methodsInput, usersUncheckedCreateWithoutPayment_methodsInput>
  }

  export type usersUpsertWithoutPayment_methodsInput = {
    update: XOR<usersUpdateWithoutPayment_methodsInput, usersUncheckedUpdateWithoutPayment_methodsInput>
    create: XOR<usersCreateWithoutPayment_methodsInput, usersUncheckedCreateWithoutPayment_methodsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutPayment_methodsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutPayment_methodsInput, usersUncheckedUpdateWithoutPayment_methodsInput>
  }

  export type usersUpdateWithoutPayment_methodsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_sessions?: user_sessionsUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutPayment_methodsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUncheckedUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUncheckedUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type usersCreateWithoutUser_sessionsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsCreateNestedManyWithoutUserInput
    user_settings?: user_settingsCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutUser_sessionsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsUncheckedCreateNestedManyWithoutUserInput
    user_settings?: user_settingsUncheckedCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsUncheckedCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutUser_sessionsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
  }

  export type usersUpsertWithoutUser_sessionsInput = {
    update: XOR<usersUpdateWithoutUser_sessionsInput, usersUncheckedUpdateWithoutUser_sessionsInput>
    create: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutUser_sessionsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutUser_sessionsInput, usersUncheckedUpdateWithoutUser_sessionsInput>
  }

  export type usersUpdateWithoutUser_sessionsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_sessionsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUncheckedUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUncheckedUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUncheckedUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type usersCreateWithoutUser_settingsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUserInput
    payment_transactions?: payment_transactionsCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutUser_settingsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsUncheckedCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUserInput
    payment_transactions?: payment_transactionsUncheckedCreateNestedManyWithoutUserInput
    identity_verifications?: identity_verificationsUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutUser_settingsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_settingsInput, usersUncheckedCreateWithoutUser_settingsInput>
  }

  export type usersUpsertWithoutUser_settingsInput = {
    update: XOR<usersUpdateWithoutUser_settingsInput, usersUncheckedUpdateWithoutUser_settingsInput>
    create: XOR<usersCreateWithoutUser_settingsInput, usersUncheckedCreateWithoutUser_settingsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutUser_settingsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutUser_settingsInput, usersUncheckedUpdateWithoutUser_settingsInput>
  }

  export type usersUpdateWithoutUser_settingsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUserNestedInput
    payment_transactions?: payment_transactionsUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_settingsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUncheckedUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUserNestedInput
    payment_transactions?: payment_transactionsUncheckedUpdateManyWithoutUserNestedInput
    identity_verifications?: identity_verificationsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type usersCreateWithoutPayment_transactionsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUserInput
    user_settings?: user_settingsCreateNestedOneWithoutUserInput
    identity_verifications?: identity_verificationsCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutPayment_transactionsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsUncheckedCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUserInput
    user_settings?: user_settingsUncheckedCreateNestedOneWithoutUserInput
    identity_verifications?: identity_verificationsUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutPayment_transactionsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutPayment_transactionsInput, usersUncheckedCreateWithoutPayment_transactionsInput>
  }

  export type usersUpsertWithoutPayment_transactionsInput = {
    update: XOR<usersUpdateWithoutPayment_transactionsInput, usersUncheckedUpdateWithoutPayment_transactionsInput>
    create: XOR<usersCreateWithoutPayment_transactionsInput, usersUncheckedCreateWithoutPayment_transactionsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutPayment_transactionsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutPayment_transactionsInput, usersUncheckedUpdateWithoutPayment_transactionsInput>
  }

  export type usersUpdateWithoutPayment_transactionsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUpdateOneWithoutUserNestedInput
    identity_verifications?: identity_verificationsUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutPayment_transactionsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUncheckedUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUncheckedUpdateOneWithoutUserNestedInput
    identity_verifications?: identity_verificationsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type usersCreateWithoutIdentity_verificationsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUserInput
    user_settings?: user_settingsCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutIdentity_verificationsInput = {
    seq?: bigint | number
    uuid: string
    email?: string | null
    password_hash?: string | null
    social_provider?: string
    social_id?: string | null
    name: string
    preferred_payment_seq?: bigint | number | null
    is_verified?: boolean
    verified_at?: Date | string | null
    ci?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment_methods?: payment_methodsUncheckedCreateNestedManyWithoutUserInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUserInput
    user_settings?: user_settingsUncheckedCreateNestedOneWithoutUserInput
    payment_transactions?: payment_transactionsUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutIdentity_verificationsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutIdentity_verificationsInput, usersUncheckedCreateWithoutIdentity_verificationsInput>
  }

  export type usersUpsertWithoutIdentity_verificationsInput = {
    update: XOR<usersUpdateWithoutIdentity_verificationsInput, usersUncheckedUpdateWithoutIdentity_verificationsInput>
    create: XOR<usersCreateWithoutIdentity_verificationsInput, usersUncheckedCreateWithoutIdentity_verificationsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutIdentity_verificationsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutIdentity_verificationsInput, usersUncheckedUpdateWithoutIdentity_verificationsInput>
  }

  export type usersUpdateWithoutIdentity_verificationsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutIdentity_verificationsInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: NullableStringFieldUpdateOperationsInput | string | null
    social_provider?: StringFieldUpdateOperationsInput | string
    social_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    preferred_payment_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    is_verified?: BoolFieldUpdateOperationsInput | boolean
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment_methods?: payment_methodsUncheckedUpdateManyWithoutUserNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUserNestedInput
    user_settings?: user_settingsUncheckedUpdateOneWithoutUserNestedInput
    payment_transactions?: payment_transactionsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type payment_methodsCreateManyUserInput = {
    seq?: bigint | number
    type: $Enums.PaymentType
    card_number_hash?: string | null
    last_4_nums: string
    card_holder_name?: string | null
    provider_name: string
    card_brand?: string | null
    expiry_month?: string | null
    expiry_year?: string | null
    cvv_hash?: string | null
    billing_address?: string | null
    billing_zip?: string | null
    alias?: string | null
    is_primary?: boolean
    billing_key_id?: string | null
    billing_key_status?: string | null
    operator?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type user_sessionsCreateManyUserInput = {
    seq?: bigint | number
    access_token: string
    refresh_token: string
    expires_at: Date | string
    device_info?: string | null
    created_at?: Date | string
  }

  export type payment_transactionsCreateManyUserInput = {
    seq?: bigint | number
    uuid: string
    payment_method_seq?: bigint | number | null
    merchant_name: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    benefit_value?: Decimal | DecimalJsLike | number | string | null
    benefit_desc?: string | null
    compared_at?: Date | string | null
    portone_payment_id?: string | null
    portone_transaction_id?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type identity_verificationsCreateManyUserInput = {
    seq?: bigint | number
    uuid: string
    portone_id: string
    channel_key: string
    operator: string
    method: string
    status: string
    customer_name?: string | null
    customer_phone?: string | null
    customer_email?: string | null
    ci?: string | null
    di?: string | null
    custom_data?: string | null
    requested_at: Date | string
    status_changed_at: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type payment_methodsUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    card_number_hash?: NullableStringFieldUpdateOperationsInput | string | null
    last_4_nums?: StringFieldUpdateOperationsInput | string
    card_holder_name?: NullableStringFieldUpdateOperationsInput | string | null
    provider_name?: StringFieldUpdateOperationsInput | string
    card_brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_month?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_year?: NullableStringFieldUpdateOperationsInput | string | null
    cvv_hash?: NullableStringFieldUpdateOperationsInput | string | null
    billing_address?: NullableStringFieldUpdateOperationsInput | string | null
    billing_zip?: NullableStringFieldUpdateOperationsInput | string | null
    alias?: NullableStringFieldUpdateOperationsInput | string | null
    is_primary?: BoolFieldUpdateOperationsInput | boolean
    billing_key_id?: NullableStringFieldUpdateOperationsInput | string | null
    billing_key_status?: NullableStringFieldUpdateOperationsInput | string | null
    operator?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_methodsUncheckedUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    card_number_hash?: NullableStringFieldUpdateOperationsInput | string | null
    last_4_nums?: StringFieldUpdateOperationsInput | string
    card_holder_name?: NullableStringFieldUpdateOperationsInput | string | null
    provider_name?: StringFieldUpdateOperationsInput | string
    card_brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_month?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_year?: NullableStringFieldUpdateOperationsInput | string | null
    cvv_hash?: NullableStringFieldUpdateOperationsInput | string | null
    billing_address?: NullableStringFieldUpdateOperationsInput | string | null
    billing_zip?: NullableStringFieldUpdateOperationsInput | string | null
    alias?: NullableStringFieldUpdateOperationsInput | string | null
    is_primary?: BoolFieldUpdateOperationsInput | boolean
    billing_key_id?: NullableStringFieldUpdateOperationsInput | string | null
    billing_key_status?: NullableStringFieldUpdateOperationsInput | string | null
    operator?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_methodsUncheckedUpdateManyWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    card_number_hash?: NullableStringFieldUpdateOperationsInput | string | null
    last_4_nums?: StringFieldUpdateOperationsInput | string
    card_holder_name?: NullableStringFieldUpdateOperationsInput | string | null
    provider_name?: StringFieldUpdateOperationsInput | string
    card_brand?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_month?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_year?: NullableStringFieldUpdateOperationsInput | string | null
    cvv_hash?: NullableStringFieldUpdateOperationsInput | string | null
    billing_address?: NullableStringFieldUpdateOperationsInput | string | null
    billing_zip?: NullableStringFieldUpdateOperationsInput | string | null
    alias?: NullableStringFieldUpdateOperationsInput | string | null
    is_primary?: BoolFieldUpdateOperationsInput | boolean
    billing_key_id?: NullableStringFieldUpdateOperationsInput | string | null
    billing_key_status?: NullableStringFieldUpdateOperationsInput | string | null
    operator?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device_info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsUncheckedUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device_info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsUncheckedUpdateManyWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device_info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_transactionsUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    payment_method_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    merchant_name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    benefit_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: NullableStringFieldUpdateOperationsInput | string | null
    compared_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    portone_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    portone_transaction_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_transactionsUncheckedUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    payment_method_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    merchant_name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    benefit_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: NullableStringFieldUpdateOperationsInput | string | null
    compared_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    portone_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    portone_transaction_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type payment_transactionsUncheckedUpdateManyWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    payment_method_seq?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    merchant_name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    benefit_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    benefit_desc?: NullableStringFieldUpdateOperationsInput | string | null
    compared_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    portone_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    portone_transaction_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type identity_verificationsUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    portone_id?: StringFieldUpdateOperationsInput | string
    channel_key?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    customer_name?: NullableStringFieldUpdateOperationsInput | string | null
    customer_phone?: NullableStringFieldUpdateOperationsInput | string | null
    customer_email?: NullableStringFieldUpdateOperationsInput | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    di?: NullableStringFieldUpdateOperationsInput | string | null
    custom_data?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status_changed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type identity_verificationsUncheckedUpdateWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    portone_id?: StringFieldUpdateOperationsInput | string
    channel_key?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    customer_name?: NullableStringFieldUpdateOperationsInput | string | null
    customer_phone?: NullableStringFieldUpdateOperationsInput | string | null
    customer_email?: NullableStringFieldUpdateOperationsInput | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    di?: NullableStringFieldUpdateOperationsInput | string | null
    custom_data?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status_changed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type identity_verificationsUncheckedUpdateManyWithoutUserInput = {
    seq?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    portone_id?: StringFieldUpdateOperationsInput | string
    channel_key?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    customer_name?: NullableStringFieldUpdateOperationsInput | string | null
    customer_phone?: NullableStringFieldUpdateOperationsInput | string | null
    customer_email?: NullableStringFieldUpdateOperationsInput | string | null
    ci?: NullableStringFieldUpdateOperationsInput | string | null
    di?: NullableStringFieldUpdateOperationsInput | string | null
    custom_data?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status_changed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}