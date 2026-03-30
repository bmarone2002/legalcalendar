
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model SubEvent
 * 
 */
export type SubEvent = $Result.DefaultSelection<Prisma.$SubEventPayload>
/**
 * Model Rinvio
 * 
 */
export type Rinvio = $Result.DefaultSelection<Prisma.$RinvioPayload>
/**
 * Model Setting
 * 
 */
export type Setting = $Result.DefaultSelection<Prisma.$SettingPayload>
/**
 * Model NotificationDevice
 * 
 */
export type NotificationDevice = $Result.DefaultSelection<Prisma.$NotificationDevicePayload>
/**
 * Model EventNotificationPreference
 * 
 */
export type EventNotificationPreference = $Result.DefaultSelection<Prisma.$EventNotificationPreferencePayload>
/**
 * Model CalendarShare
 * 
 */
export type CalendarShare = $Result.DefaultSelection<Prisma.$CalendarSharePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SharePermission: {
  VIEW_ONLY: 'VIEW_ONLY',
  FULL: 'FULL'
};

export type SharePermission = (typeof SharePermission)[keyof typeof SharePermission]

}

export type SharePermission = $Enums.SharePermission

export const SharePermission: typeof $Enums.SharePermission

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs>;

  /**
   * `prisma.subEvent`: Exposes CRUD operations for the **SubEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubEvents
    * const subEvents = await prisma.subEvent.findMany()
    * ```
    */
  get subEvent(): Prisma.SubEventDelegate<ExtArgs>;

  /**
   * `prisma.rinvio`: Exposes CRUD operations for the **Rinvio** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rinvios
    * const rinvios = await prisma.rinvio.findMany()
    * ```
    */
  get rinvio(): Prisma.RinvioDelegate<ExtArgs>;

  /**
   * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.setting.findMany()
    * ```
    */
  get setting(): Prisma.SettingDelegate<ExtArgs>;

  /**
   * `prisma.notificationDevice`: Exposes CRUD operations for the **NotificationDevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationDevices
    * const notificationDevices = await prisma.notificationDevice.findMany()
    * ```
    */
  get notificationDevice(): Prisma.NotificationDeviceDelegate<ExtArgs>;

  /**
   * `prisma.eventNotificationPreference`: Exposes CRUD operations for the **EventNotificationPreference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventNotificationPreferences
    * const eventNotificationPreferences = await prisma.eventNotificationPreference.findMany()
    * ```
    */
  get eventNotificationPreference(): Prisma.EventNotificationPreferenceDelegate<ExtArgs>;

  /**
   * `prisma.calendarShare`: Exposes CRUD operations for the **CalendarShare** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CalendarShares
    * const calendarShares = await prisma.calendarShare.findMany()
    * ```
    */
  get calendarShare(): Prisma.CalendarShareDelegate<ExtArgs>;
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
  export import NotFoundError = runtime.NotFoundError

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
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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
    User: 'User',
    Event: 'Event',
    SubEvent: 'SubEvent',
    Rinvio: 'Rinvio',
    Setting: 'Setting',
    NotificationDevice: 'NotificationDevice',
    EventNotificationPreference: 'EventNotificationPreference',
    CalendarShare: 'CalendarShare'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "event" | "subEvent" | "rinvio" | "setting" | "notificationDevice" | "eventNotificationPreference" | "calendarShare"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      SubEvent: {
        payload: Prisma.$SubEventPayload<ExtArgs>
        fields: Prisma.SubEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>
          }
          findFirst: {
            args: Prisma.SubEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>
          }
          findMany: {
            args: Prisma.SubEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>[]
          }
          create: {
            args: Prisma.SubEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>
          }
          createMany: {
            args: Prisma.SubEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>[]
          }
          delete: {
            args: Prisma.SubEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>
          }
          update: {
            args: Prisma.SubEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>
          }
          deleteMany: {
            args: Prisma.SubEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubEventPayload>
          }
          aggregate: {
            args: Prisma.SubEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubEvent>
          }
          groupBy: {
            args: Prisma.SubEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubEventCountArgs<ExtArgs>
            result: $Utils.Optional<SubEventCountAggregateOutputType> | number
          }
        }
      }
      Rinvio: {
        payload: Prisma.$RinvioPayload<ExtArgs>
        fields: Prisma.RinvioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RinvioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RinvioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>
          }
          findFirst: {
            args: Prisma.RinvioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RinvioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>
          }
          findMany: {
            args: Prisma.RinvioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>[]
          }
          create: {
            args: Prisma.RinvioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>
          }
          createMany: {
            args: Prisma.RinvioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RinvioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>[]
          }
          delete: {
            args: Prisma.RinvioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>
          }
          update: {
            args: Prisma.RinvioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>
          }
          deleteMany: {
            args: Prisma.RinvioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RinvioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RinvioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RinvioPayload>
          }
          aggregate: {
            args: Prisma.RinvioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRinvio>
          }
          groupBy: {
            args: Prisma.RinvioGroupByArgs<ExtArgs>
            result: $Utils.Optional<RinvioGroupByOutputType>[]
          }
          count: {
            args: Prisma.RinvioCountArgs<ExtArgs>
            result: $Utils.Optional<RinvioCountAggregateOutputType> | number
          }
        }
      }
      Setting: {
        payload: Prisma.$SettingPayload<ExtArgs>
        fields: Prisma.SettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findFirst: {
            args: Prisma.SettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findMany: {
            args: Prisma.SettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          create: {
            args: Prisma.SettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          createMany: {
            args: Prisma.SettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          delete: {
            args: Prisma.SettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          update: {
            args: Prisma.SettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          deleteMany: {
            args: Prisma.SettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          aggregate: {
            args: Prisma.SettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSetting>
          }
          groupBy: {
            args: Prisma.SettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingCountArgs<ExtArgs>
            result: $Utils.Optional<SettingCountAggregateOutputType> | number
          }
        }
      }
      NotificationDevice: {
        payload: Prisma.$NotificationDevicePayload<ExtArgs>
        fields: Prisma.NotificationDeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationDeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationDeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>
          }
          findFirst: {
            args: Prisma.NotificationDeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationDeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>
          }
          findMany: {
            args: Prisma.NotificationDeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>[]
          }
          create: {
            args: Prisma.NotificationDeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>
          }
          createMany: {
            args: Prisma.NotificationDeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationDeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>[]
          }
          delete: {
            args: Prisma.NotificationDeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>
          }
          update: {
            args: Prisma.NotificationDeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationDeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationDeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDevicePayload>
          }
          aggregate: {
            args: Prisma.NotificationDeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationDevice>
          }
          groupBy: {
            args: Prisma.NotificationDeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationDeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationDeviceCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationDeviceCountAggregateOutputType> | number
          }
        }
      }
      EventNotificationPreference: {
        payload: Prisma.$EventNotificationPreferencePayload<ExtArgs>
        fields: Prisma.EventNotificationPreferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventNotificationPreferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventNotificationPreferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>
          }
          findFirst: {
            args: Prisma.EventNotificationPreferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventNotificationPreferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>
          }
          findMany: {
            args: Prisma.EventNotificationPreferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>[]
          }
          create: {
            args: Prisma.EventNotificationPreferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>
          }
          createMany: {
            args: Prisma.EventNotificationPreferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventNotificationPreferenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>[]
          }
          delete: {
            args: Prisma.EventNotificationPreferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>
          }
          update: {
            args: Prisma.EventNotificationPreferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>
          }
          deleteMany: {
            args: Prisma.EventNotificationPreferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventNotificationPreferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventNotificationPreferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventNotificationPreferencePayload>
          }
          aggregate: {
            args: Prisma.EventNotificationPreferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventNotificationPreference>
          }
          groupBy: {
            args: Prisma.EventNotificationPreferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventNotificationPreferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventNotificationPreferenceCountArgs<ExtArgs>
            result: $Utils.Optional<EventNotificationPreferenceCountAggregateOutputType> | number
          }
        }
      }
      CalendarShare: {
        payload: Prisma.$CalendarSharePayload<ExtArgs>
        fields: Prisma.CalendarShareFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CalendarShareFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CalendarShareFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>
          }
          findFirst: {
            args: Prisma.CalendarShareFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CalendarShareFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>
          }
          findMany: {
            args: Prisma.CalendarShareFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>[]
          }
          create: {
            args: Prisma.CalendarShareCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>
          }
          createMany: {
            args: Prisma.CalendarShareCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CalendarShareCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>[]
          }
          delete: {
            args: Prisma.CalendarShareDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>
          }
          update: {
            args: Prisma.CalendarShareUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>
          }
          deleteMany: {
            args: Prisma.CalendarShareDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CalendarShareUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CalendarShareUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarSharePayload>
          }
          aggregate: {
            args: Prisma.CalendarShareAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCalendarShare>
          }
          groupBy: {
            args: Prisma.CalendarShareGroupByArgs<ExtArgs>
            result: $Utils.Optional<CalendarShareGroupByOutputType>[]
          }
          count: {
            args: Prisma.CalendarShareCountArgs<ExtArgs>
            result: $Utils.Optional<CalendarShareCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    events: number
    notificationDevices: number
    eventNotificationPrefs: number
    sharedByMe: number
    sharedWithMe: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | UserCountOutputTypeCountEventsArgs
    notificationDevices?: boolean | UserCountOutputTypeCountNotificationDevicesArgs
    eventNotificationPrefs?: boolean | UserCountOutputTypeCountEventNotificationPrefsArgs
    sharedByMe?: boolean | UserCountOutputTypeCountSharedByMeArgs
    sharedWithMe?: boolean | UserCountOutputTypeCountSharedWithMeArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationDeviceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventNotificationPrefsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventNotificationPreferenceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedByMeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalendarShareWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedWithMeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalendarShareWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    subEvents: number
    rinvii: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subEvents?: boolean | EventCountOutputTypeCountSubEventsArgs
    rinvii?: boolean | EventCountOutputTypeCountRinviiArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountSubEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubEventWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountRinviiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RinvioWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    clerkUserId: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    clerkUserId: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    clerkUserId: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    clerkUserId?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    clerkUserId?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    clerkUserId?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    clerkUserId: string
    email: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkUserId?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    events?: boolean | User$eventsArgs<ExtArgs>
    notificationDevices?: boolean | User$notificationDevicesArgs<ExtArgs>
    eventNotificationPrefs?: boolean | User$eventNotificationPrefsArgs<ExtArgs>
    sharedByMe?: boolean | User$sharedByMeArgs<ExtArgs>
    sharedWithMe?: boolean | User$sharedWithMeArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkUserId?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    clerkUserId?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | User$eventsArgs<ExtArgs>
    notificationDevices?: boolean | User$notificationDevicesArgs<ExtArgs>
    eventNotificationPrefs?: boolean | User$eventNotificationPrefsArgs<ExtArgs>
    sharedByMe?: boolean | User$sharedByMeArgs<ExtArgs>
    sharedWithMe?: boolean | User$sharedWithMeArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      events: Prisma.$EventPayload<ExtArgs>[]
      notificationDevices: Prisma.$NotificationDevicePayload<ExtArgs>[]
      eventNotificationPrefs: Prisma.$EventNotificationPreferencePayload<ExtArgs>[]
      sharedByMe: Prisma.$CalendarSharePayload<ExtArgs>[]
      sharedWithMe: Prisma.$CalendarSharePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clerkUserId: string
      email: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends User$eventsArgs<ExtArgs> = {}>(args?: Subset<T, User$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany"> | Null>
    notificationDevices<T extends User$notificationDevicesArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationDevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "findMany"> | Null>
    eventNotificationPrefs<T extends User$eventNotificationPrefsArgs<ExtArgs> = {}>(args?: Subset<T, User$eventNotificationPrefsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "findMany"> | Null>
    sharedByMe<T extends User$sharedByMeArgs<ExtArgs> = {}>(args?: Subset<T, User$sharedByMeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "findMany"> | Null>
    sharedWithMe<T extends User$sharedWithMeArgs<ExtArgs> = {}>(args?: Subset<T, User$sharedWithMeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly clerkUserId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.events
   */
  export type User$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * User.notificationDevices
   */
  export type User$notificationDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    where?: NotificationDeviceWhereInput
    orderBy?: NotificationDeviceOrderByWithRelationInput | NotificationDeviceOrderByWithRelationInput[]
    cursor?: NotificationDeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationDeviceScalarFieldEnum | NotificationDeviceScalarFieldEnum[]
  }

  /**
   * User.eventNotificationPrefs
   */
  export type User$eventNotificationPrefsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    where?: EventNotificationPreferenceWhereInput
    orderBy?: EventNotificationPreferenceOrderByWithRelationInput | EventNotificationPreferenceOrderByWithRelationInput[]
    cursor?: EventNotificationPreferenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventNotificationPreferenceScalarFieldEnum | EventNotificationPreferenceScalarFieldEnum[]
  }

  /**
   * User.sharedByMe
   */
  export type User$sharedByMeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    where?: CalendarShareWhereInput
    orderBy?: CalendarShareOrderByWithRelationInput | CalendarShareOrderByWithRelationInput[]
    cursor?: CalendarShareWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CalendarShareScalarFieldEnum | CalendarShareScalarFieldEnum[]
  }

  /**
   * User.sharedWithMe
   */
  export type User$sharedWithMeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    where?: CalendarShareWhereInput
    orderBy?: CalendarShareOrderByWithRelationInput | CalendarShareOrderByWithRelationInput[]
    cursor?: CalendarShareWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CalendarShareScalarFieldEnum | CalendarShareScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    startAt: Date | null
    endAt: Date | null
    type: string | null
    tags: string | null
    caseId: string | null
    notes: string | null
    generateSubEvents: boolean | null
    ruleTemplateId: string | null
    ruleParams: string | null
    macroType: string | null
    macroArea: string | null
    procedimento: string | null
    parteProcessuale: string | null
    eventoCode: string | null
    inputs: string | null
    color: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    orgId: string | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    startAt: Date | null
    endAt: Date | null
    type: string | null
    tags: string | null
    caseId: string | null
    notes: string | null
    generateSubEvents: boolean | null
    ruleTemplateId: string | null
    ruleParams: string | null
    macroType: string | null
    macroArea: string | null
    procedimento: string | null
    parteProcessuale: string | null
    eventoCode: string | null
    inputs: string | null
    color: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    orgId: string | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    title: number
    description: number
    startAt: number
    endAt: number
    type: number
    tags: number
    caseId: number
    notes: number
    generateSubEvents: number
    ruleTemplateId: number
    ruleParams: number
    macroType: number
    macroArea: number
    procedimento: number
    parteProcessuale: number
    eventoCode: number
    inputs: number
    color: number
    status: number
    createdAt: number
    updatedAt: number
    userId: number
    orgId: number
    _all: number
  }


  export type EventMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    startAt?: true
    endAt?: true
    type?: true
    tags?: true
    caseId?: true
    notes?: true
    generateSubEvents?: true
    ruleTemplateId?: true
    ruleParams?: true
    macroType?: true
    macroArea?: true
    procedimento?: true
    parteProcessuale?: true
    eventoCode?: true
    inputs?: true
    color?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    orgId?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    startAt?: true
    endAt?: true
    type?: true
    tags?: true
    caseId?: true
    notes?: true
    generateSubEvents?: true
    ruleTemplateId?: true
    ruleParams?: true
    macroType?: true
    macroArea?: true
    procedimento?: true
    parteProcessuale?: true
    eventoCode?: true
    inputs?: true
    color?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    orgId?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    startAt?: true
    endAt?: true
    type?: true
    tags?: true
    caseId?: true
    notes?: true
    generateSubEvents?: true
    ruleTemplateId?: true
    ruleParams?: true
    macroType?: true
    macroArea?: true
    procedimento?: true
    parteProcessuale?: true
    eventoCode?: true
    inputs?: true
    color?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    orgId?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    title: string
    description: string | null
    startAt: Date
    endAt: Date
    type: string
    tags: string
    caseId: string | null
    notes: string | null
    generateSubEvents: boolean
    ruleTemplateId: string | null
    ruleParams: string | null
    macroType: string | null
    macroArea: string | null
    procedimento: string | null
    parteProcessuale: string | null
    eventoCode: string | null
    inputs: string | null
    color: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    userId: string
    orgId: string | null
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    startAt?: boolean
    endAt?: boolean
    type?: boolean
    tags?: boolean
    caseId?: boolean
    notes?: boolean
    generateSubEvents?: boolean
    ruleTemplateId?: boolean
    ruleParams?: boolean
    macroType?: boolean
    macroArea?: boolean
    procedimento?: boolean
    parteProcessuale?: boolean
    eventoCode?: boolean
    inputs?: boolean
    color?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    orgId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    subEvents?: boolean | Event$subEventsArgs<ExtArgs>
    rinvii?: boolean | Event$rinviiArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    startAt?: boolean
    endAt?: boolean
    type?: boolean
    tags?: boolean
    caseId?: boolean
    notes?: boolean
    generateSubEvents?: boolean
    ruleTemplateId?: boolean
    ruleParams?: boolean
    macroType?: boolean
    macroArea?: boolean
    procedimento?: boolean
    parteProcessuale?: boolean
    eventoCode?: boolean
    inputs?: boolean
    color?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    orgId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    startAt?: boolean
    endAt?: boolean
    type?: boolean
    tags?: boolean
    caseId?: boolean
    notes?: boolean
    generateSubEvents?: boolean
    ruleTemplateId?: boolean
    ruleParams?: boolean
    macroType?: boolean
    macroArea?: boolean
    procedimento?: boolean
    parteProcessuale?: boolean
    eventoCode?: boolean
    inputs?: boolean
    color?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    orgId?: boolean
  }

  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    subEvents?: boolean | Event$subEventsArgs<ExtArgs>
    rinvii?: boolean | Event$rinviiArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      subEvents: Prisma.$SubEventPayload<ExtArgs>[]
      rinvii: Prisma.$RinvioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      startAt: Date
      endAt: Date
      type: string
      tags: string
      caseId: string | null
      notes: string | null
      generateSubEvents: boolean
      ruleTemplateId: string | null
      ruleParams: string | null
      macroType: string | null
      macroArea: string | null
      procedimento: string | null
      parteProcessuale: string | null
      eventoCode: string | null
      inputs: string | null
      color: string | null
      status: string
      createdAt: Date
      updatedAt: Date
      userId: string
      orgId: string | null
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
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
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    subEvents<T extends Event$subEventsArgs<ExtArgs> = {}>(args?: Subset<T, Event$subEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "findMany"> | Null>
    rinvii<T extends Event$rinviiArgs<ExtArgs> = {}>(args?: Subset<T, Event$rinviiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Event model
   */ 
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly title: FieldRef<"Event", 'String'>
    readonly description: FieldRef<"Event", 'String'>
    readonly startAt: FieldRef<"Event", 'DateTime'>
    readonly endAt: FieldRef<"Event", 'DateTime'>
    readonly type: FieldRef<"Event", 'String'>
    readonly tags: FieldRef<"Event", 'String'>
    readonly caseId: FieldRef<"Event", 'String'>
    readonly notes: FieldRef<"Event", 'String'>
    readonly generateSubEvents: FieldRef<"Event", 'Boolean'>
    readonly ruleTemplateId: FieldRef<"Event", 'String'>
    readonly ruleParams: FieldRef<"Event", 'String'>
    readonly macroType: FieldRef<"Event", 'String'>
    readonly macroArea: FieldRef<"Event", 'String'>
    readonly procedimento: FieldRef<"Event", 'String'>
    readonly parteProcessuale: FieldRef<"Event", 'String'>
    readonly eventoCode: FieldRef<"Event", 'String'>
    readonly inputs: FieldRef<"Event", 'String'>
    readonly color: FieldRef<"Event", 'String'>
    readonly status: FieldRef<"Event", 'String'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly updatedAt: FieldRef<"Event", 'DateTime'>
    readonly userId: FieldRef<"Event", 'String'>
    readonly orgId: FieldRef<"Event", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
  }

  /**
   * Event.subEvents
   */
  export type Event$subEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    where?: SubEventWhereInput
    orderBy?: SubEventOrderByWithRelationInput | SubEventOrderByWithRelationInput[]
    cursor?: SubEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubEventScalarFieldEnum | SubEventScalarFieldEnum[]
  }

  /**
   * Event.rinvii
   */
  export type Event$rinviiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    where?: RinvioWhereInput
    orderBy?: RinvioOrderByWithRelationInput | RinvioOrderByWithRelationInput[]
    cursor?: RinvioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RinvioScalarFieldEnum | RinvioScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model SubEvent
   */

  export type AggregateSubEvent = {
    _count: SubEventCountAggregateOutputType | null
    _avg: SubEventAvgAggregateOutputType | null
    _sum: SubEventSumAggregateOutputType | null
    _min: SubEventMinAggregateOutputType | null
    _max: SubEventMaxAggregateOutputType | null
  }

  export type SubEventAvgAggregateOutputType = {
    priority: number | null
  }

  export type SubEventSumAggregateOutputType = {
    priority: number | null
  }

  export type SubEventMinAggregateOutputType = {
    id: string | null
    parentEventId: string | null
    title: string | null
    kind: string | null
    dueAt: Date | null
    status: string | null
    priority: number | null
    ruleId: string | null
    ruleParams: string | null
    explanation: string | null
    createdBy: string | null
    locked: boolean | null
    isPlaceholder: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubEventMaxAggregateOutputType = {
    id: string | null
    parentEventId: string | null
    title: string | null
    kind: string | null
    dueAt: Date | null
    status: string | null
    priority: number | null
    ruleId: string | null
    ruleParams: string | null
    explanation: string | null
    createdBy: string | null
    locked: boolean | null
    isPlaceholder: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubEventCountAggregateOutputType = {
    id: number
    parentEventId: number
    title: number
    kind: number
    dueAt: number
    status: number
    priority: number
    ruleId: number
    ruleParams: number
    explanation: number
    createdBy: number
    locked: number
    isPlaceholder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubEventAvgAggregateInputType = {
    priority?: true
  }

  export type SubEventSumAggregateInputType = {
    priority?: true
  }

  export type SubEventMinAggregateInputType = {
    id?: true
    parentEventId?: true
    title?: true
    kind?: true
    dueAt?: true
    status?: true
    priority?: true
    ruleId?: true
    ruleParams?: true
    explanation?: true
    createdBy?: true
    locked?: true
    isPlaceholder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubEventMaxAggregateInputType = {
    id?: true
    parentEventId?: true
    title?: true
    kind?: true
    dueAt?: true
    status?: true
    priority?: true
    ruleId?: true
    ruleParams?: true
    explanation?: true
    createdBy?: true
    locked?: true
    isPlaceholder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubEventCountAggregateInputType = {
    id?: true
    parentEventId?: true
    title?: true
    kind?: true
    dueAt?: true
    status?: true
    priority?: true
    ruleId?: true
    ruleParams?: true
    explanation?: true
    createdBy?: true
    locked?: true
    isPlaceholder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubEvent to aggregate.
     */
    where?: SubEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubEvents to fetch.
     */
    orderBy?: SubEventOrderByWithRelationInput | SubEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubEvents
    **/
    _count?: true | SubEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubEventMaxAggregateInputType
  }

  export type GetSubEventAggregateType<T extends SubEventAggregateArgs> = {
        [P in keyof T & keyof AggregateSubEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubEvent[P]>
      : GetScalarType<T[P], AggregateSubEvent[P]>
  }




  export type SubEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubEventWhereInput
    orderBy?: SubEventOrderByWithAggregationInput | SubEventOrderByWithAggregationInput[]
    by: SubEventScalarFieldEnum[] | SubEventScalarFieldEnum
    having?: SubEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubEventCountAggregateInputType | true
    _avg?: SubEventAvgAggregateInputType
    _sum?: SubEventSumAggregateInputType
    _min?: SubEventMinAggregateInputType
    _max?: SubEventMaxAggregateInputType
  }

  export type SubEventGroupByOutputType = {
    id: string
    parentEventId: string
    title: string
    kind: string
    dueAt: Date | null
    status: string
    priority: number
    ruleId: string | null
    ruleParams: string | null
    explanation: string | null
    createdBy: string
    locked: boolean
    isPlaceholder: boolean
    createdAt: Date
    updatedAt: Date
    _count: SubEventCountAggregateOutputType | null
    _avg: SubEventAvgAggregateOutputType | null
    _sum: SubEventSumAggregateOutputType | null
    _min: SubEventMinAggregateOutputType | null
    _max: SubEventMaxAggregateOutputType | null
  }

  type GetSubEventGroupByPayload<T extends SubEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubEventGroupByOutputType[P]>
            : GetScalarType<T[P], SubEventGroupByOutputType[P]>
        }
      >
    >


  export type SubEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentEventId?: boolean
    title?: boolean
    kind?: boolean
    dueAt?: boolean
    status?: boolean
    priority?: boolean
    ruleId?: boolean
    ruleParams?: boolean
    explanation?: boolean
    createdBy?: boolean
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subEvent"]>

  export type SubEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentEventId?: boolean
    title?: boolean
    kind?: boolean
    dueAt?: boolean
    status?: boolean
    priority?: boolean
    ruleId?: boolean
    ruleParams?: boolean
    explanation?: boolean
    createdBy?: boolean
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subEvent"]>

  export type SubEventSelectScalar = {
    id?: boolean
    parentEventId?: boolean
    title?: boolean
    kind?: boolean
    dueAt?: boolean
    status?: boolean
    priority?: boolean
    ruleId?: boolean
    ruleParams?: boolean
    explanation?: boolean
    createdBy?: boolean
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type SubEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $SubEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubEvent"
    objects: {
      parentEvent: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      parentEventId: string
      title: string
      kind: string
      dueAt: Date | null
      status: string
      priority: number
      ruleId: string | null
      ruleParams: string | null
      explanation: string | null
      createdBy: string
      locked: boolean
      isPlaceholder: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subEvent"]>
    composites: {}
  }

  type SubEventGetPayload<S extends boolean | null | undefined | SubEventDefaultArgs> = $Result.GetResult<Prisma.$SubEventPayload, S>

  type SubEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubEventCountAggregateInputType | true
    }

  export interface SubEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubEvent'], meta: { name: 'SubEvent' } }
    /**
     * Find zero or one SubEvent that matches the filter.
     * @param {SubEventFindUniqueArgs} args - Arguments to find a SubEvent
     * @example
     * // Get one SubEvent
     * const subEvent = await prisma.subEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubEventFindUniqueArgs>(args: SelectSubset<T, SubEventFindUniqueArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SubEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubEventFindUniqueOrThrowArgs} args - Arguments to find a SubEvent
     * @example
     * // Get one SubEvent
     * const subEvent = await prisma.subEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubEventFindUniqueOrThrowArgs>(args: SelectSubset<T, SubEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SubEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubEventFindFirstArgs} args - Arguments to find a SubEvent
     * @example
     * // Get one SubEvent
     * const subEvent = await prisma.subEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubEventFindFirstArgs>(args?: SelectSubset<T, SubEventFindFirstArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SubEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubEventFindFirstOrThrowArgs} args - Arguments to find a SubEvent
     * @example
     * // Get one SubEvent
     * const subEvent = await prisma.subEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubEventFindFirstOrThrowArgs>(args?: SelectSubset<T, SubEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SubEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubEvents
     * const subEvents = await prisma.subEvent.findMany()
     * 
     * // Get first 10 SubEvents
     * const subEvents = await prisma.subEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subEventWithIdOnly = await prisma.subEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubEventFindManyArgs>(args?: SelectSubset<T, SubEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SubEvent.
     * @param {SubEventCreateArgs} args - Arguments to create a SubEvent.
     * @example
     * // Create one SubEvent
     * const SubEvent = await prisma.subEvent.create({
     *   data: {
     *     // ... data to create a SubEvent
     *   }
     * })
     * 
     */
    create<T extends SubEventCreateArgs>(args: SelectSubset<T, SubEventCreateArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SubEvents.
     * @param {SubEventCreateManyArgs} args - Arguments to create many SubEvents.
     * @example
     * // Create many SubEvents
     * const subEvent = await prisma.subEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubEventCreateManyArgs>(args?: SelectSubset<T, SubEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubEvents and returns the data saved in the database.
     * @param {SubEventCreateManyAndReturnArgs} args - Arguments to create many SubEvents.
     * @example
     * // Create many SubEvents
     * const subEvent = await prisma.subEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubEvents and only return the `id`
     * const subEventWithIdOnly = await prisma.subEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubEventCreateManyAndReturnArgs>(args?: SelectSubset<T, SubEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SubEvent.
     * @param {SubEventDeleteArgs} args - Arguments to delete one SubEvent.
     * @example
     * // Delete one SubEvent
     * const SubEvent = await prisma.subEvent.delete({
     *   where: {
     *     // ... filter to delete one SubEvent
     *   }
     * })
     * 
     */
    delete<T extends SubEventDeleteArgs>(args: SelectSubset<T, SubEventDeleteArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SubEvent.
     * @param {SubEventUpdateArgs} args - Arguments to update one SubEvent.
     * @example
     * // Update one SubEvent
     * const subEvent = await prisma.subEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubEventUpdateArgs>(args: SelectSubset<T, SubEventUpdateArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SubEvents.
     * @param {SubEventDeleteManyArgs} args - Arguments to filter SubEvents to delete.
     * @example
     * // Delete a few SubEvents
     * const { count } = await prisma.subEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubEventDeleteManyArgs>(args?: SelectSubset<T, SubEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubEvents
     * const subEvent = await prisma.subEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubEventUpdateManyArgs>(args: SelectSubset<T, SubEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SubEvent.
     * @param {SubEventUpsertArgs} args - Arguments to update or create a SubEvent.
     * @example
     * // Update or create a SubEvent
     * const subEvent = await prisma.subEvent.upsert({
     *   create: {
     *     // ... data to create a SubEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubEvent we want to update
     *   }
     * })
     */
    upsert<T extends SubEventUpsertArgs>(args: SelectSubset<T, SubEventUpsertArgs<ExtArgs>>): Prisma__SubEventClient<$Result.GetResult<Prisma.$SubEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SubEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubEventCountArgs} args - Arguments to filter SubEvents to count.
     * @example
     * // Count the number of SubEvents
     * const count = await prisma.subEvent.count({
     *   where: {
     *     // ... the filter for the SubEvents we want to count
     *   }
     * })
    **/
    count<T extends SubEventCountArgs>(
      args?: Subset<T, SubEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SubEventAggregateArgs>(args: Subset<T, SubEventAggregateArgs>): Prisma.PrismaPromise<GetSubEventAggregateType<T>>

    /**
     * Group by SubEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubEventGroupByArgs} args - Group by arguments.
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
      T extends SubEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubEventGroupByArgs['orderBy'] }
        : { orderBy?: SubEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SubEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubEvent model
   */
  readonly fields: SubEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parentEvent<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the SubEvent model
   */ 
  interface SubEventFieldRefs {
    readonly id: FieldRef<"SubEvent", 'String'>
    readonly parentEventId: FieldRef<"SubEvent", 'String'>
    readonly title: FieldRef<"SubEvent", 'String'>
    readonly kind: FieldRef<"SubEvent", 'String'>
    readonly dueAt: FieldRef<"SubEvent", 'DateTime'>
    readonly status: FieldRef<"SubEvent", 'String'>
    readonly priority: FieldRef<"SubEvent", 'Int'>
    readonly ruleId: FieldRef<"SubEvent", 'String'>
    readonly ruleParams: FieldRef<"SubEvent", 'String'>
    readonly explanation: FieldRef<"SubEvent", 'String'>
    readonly createdBy: FieldRef<"SubEvent", 'String'>
    readonly locked: FieldRef<"SubEvent", 'Boolean'>
    readonly isPlaceholder: FieldRef<"SubEvent", 'Boolean'>
    readonly createdAt: FieldRef<"SubEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"SubEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubEvent findUnique
   */
  export type SubEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * Filter, which SubEvent to fetch.
     */
    where: SubEventWhereUniqueInput
  }

  /**
   * SubEvent findUniqueOrThrow
   */
  export type SubEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * Filter, which SubEvent to fetch.
     */
    where: SubEventWhereUniqueInput
  }

  /**
   * SubEvent findFirst
   */
  export type SubEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * Filter, which SubEvent to fetch.
     */
    where?: SubEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubEvents to fetch.
     */
    orderBy?: SubEventOrderByWithRelationInput | SubEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubEvents.
     */
    cursor?: SubEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubEvents.
     */
    distinct?: SubEventScalarFieldEnum | SubEventScalarFieldEnum[]
  }

  /**
   * SubEvent findFirstOrThrow
   */
  export type SubEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * Filter, which SubEvent to fetch.
     */
    where?: SubEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubEvents to fetch.
     */
    orderBy?: SubEventOrderByWithRelationInput | SubEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubEvents.
     */
    cursor?: SubEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubEvents.
     */
    distinct?: SubEventScalarFieldEnum | SubEventScalarFieldEnum[]
  }

  /**
   * SubEvent findMany
   */
  export type SubEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * Filter, which SubEvents to fetch.
     */
    where?: SubEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubEvents to fetch.
     */
    orderBy?: SubEventOrderByWithRelationInput | SubEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubEvents.
     */
    cursor?: SubEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubEvents.
     */
    skip?: number
    distinct?: SubEventScalarFieldEnum | SubEventScalarFieldEnum[]
  }

  /**
   * SubEvent create
   */
  export type SubEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * The data needed to create a SubEvent.
     */
    data: XOR<SubEventCreateInput, SubEventUncheckedCreateInput>
  }

  /**
   * SubEvent createMany
   */
  export type SubEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubEvents.
     */
    data: SubEventCreateManyInput | SubEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubEvent createManyAndReturn
   */
  export type SubEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SubEvents.
     */
    data: SubEventCreateManyInput | SubEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubEvent update
   */
  export type SubEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * The data needed to update a SubEvent.
     */
    data: XOR<SubEventUpdateInput, SubEventUncheckedUpdateInput>
    /**
     * Choose, which SubEvent to update.
     */
    where: SubEventWhereUniqueInput
  }

  /**
   * SubEvent updateMany
   */
  export type SubEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubEvents.
     */
    data: XOR<SubEventUpdateManyMutationInput, SubEventUncheckedUpdateManyInput>
    /**
     * Filter which SubEvents to update
     */
    where?: SubEventWhereInput
  }

  /**
   * SubEvent upsert
   */
  export type SubEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * The filter to search for the SubEvent to update in case it exists.
     */
    where: SubEventWhereUniqueInput
    /**
     * In case the SubEvent found by the `where` argument doesn't exist, create a new SubEvent with this data.
     */
    create: XOR<SubEventCreateInput, SubEventUncheckedCreateInput>
    /**
     * In case the SubEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubEventUpdateInput, SubEventUncheckedUpdateInput>
  }

  /**
   * SubEvent delete
   */
  export type SubEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
    /**
     * Filter which SubEvent to delete.
     */
    where: SubEventWhereUniqueInput
  }

  /**
   * SubEvent deleteMany
   */
  export type SubEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubEvents to delete
     */
    where?: SubEventWhereInput
  }

  /**
   * SubEvent without action
   */
  export type SubEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubEvent
     */
    select?: SubEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubEventInclude<ExtArgs> | null
  }


  /**
   * Model Rinvio
   */

  export type AggregateRinvio = {
    _count: RinvioCountAggregateOutputType | null
    _avg: RinvioAvgAggregateOutputType | null
    _sum: RinvioSumAggregateOutputType | null
    _min: RinvioMinAggregateOutputType | null
    _max: RinvioMaxAggregateOutputType | null
  }

  export type RinvioAvgAggregateOutputType = {
    numero: number | null
  }

  export type RinvioSumAggregateOutputType = {
    numero: number | null
  }

  export type RinvioMinAggregateOutputType = {
    id: string | null
    parentEventId: string | null
    numero: number | null
    dataUdienza: Date | null
    tipoUdienza: string | null
    tipoUdienzaCustom: string | null
    note: string | null
    adempimenti: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RinvioMaxAggregateOutputType = {
    id: string | null
    parentEventId: string | null
    numero: number | null
    dataUdienza: Date | null
    tipoUdienza: string | null
    tipoUdienzaCustom: string | null
    note: string | null
    adempimenti: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RinvioCountAggregateOutputType = {
    id: number
    parentEventId: number
    numero: number
    dataUdienza: number
    tipoUdienza: number
    tipoUdienzaCustom: number
    note: number
    adempimenti: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RinvioAvgAggregateInputType = {
    numero?: true
  }

  export type RinvioSumAggregateInputType = {
    numero?: true
  }

  export type RinvioMinAggregateInputType = {
    id?: true
    parentEventId?: true
    numero?: true
    dataUdienza?: true
    tipoUdienza?: true
    tipoUdienzaCustom?: true
    note?: true
    adempimenti?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RinvioMaxAggregateInputType = {
    id?: true
    parentEventId?: true
    numero?: true
    dataUdienza?: true
    tipoUdienza?: true
    tipoUdienzaCustom?: true
    note?: true
    adempimenti?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RinvioCountAggregateInputType = {
    id?: true
    parentEventId?: true
    numero?: true
    dataUdienza?: true
    tipoUdienza?: true
    tipoUdienzaCustom?: true
    note?: true
    adempimenti?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RinvioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rinvio to aggregate.
     */
    where?: RinvioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rinvios to fetch.
     */
    orderBy?: RinvioOrderByWithRelationInput | RinvioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RinvioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rinvios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rinvios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rinvios
    **/
    _count?: true | RinvioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RinvioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RinvioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RinvioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RinvioMaxAggregateInputType
  }

  export type GetRinvioAggregateType<T extends RinvioAggregateArgs> = {
        [P in keyof T & keyof AggregateRinvio]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRinvio[P]>
      : GetScalarType<T[P], AggregateRinvio[P]>
  }




  export type RinvioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RinvioWhereInput
    orderBy?: RinvioOrderByWithAggregationInput | RinvioOrderByWithAggregationInput[]
    by: RinvioScalarFieldEnum[] | RinvioScalarFieldEnum
    having?: RinvioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RinvioCountAggregateInputType | true
    _avg?: RinvioAvgAggregateInputType
    _sum?: RinvioSumAggregateInputType
    _min?: RinvioMinAggregateInputType
    _max?: RinvioMaxAggregateInputType
  }

  export type RinvioGroupByOutputType = {
    id: string
    parentEventId: string
    numero: number
    dataUdienza: Date
    tipoUdienza: string
    tipoUdienzaCustom: string | null
    note: string | null
    adempimenti: string
    createdAt: Date
    updatedAt: Date
    _count: RinvioCountAggregateOutputType | null
    _avg: RinvioAvgAggregateOutputType | null
    _sum: RinvioSumAggregateOutputType | null
    _min: RinvioMinAggregateOutputType | null
    _max: RinvioMaxAggregateOutputType | null
  }

  type GetRinvioGroupByPayload<T extends RinvioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RinvioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RinvioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RinvioGroupByOutputType[P]>
            : GetScalarType<T[P], RinvioGroupByOutputType[P]>
        }
      >
    >


  export type RinvioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentEventId?: boolean
    numero?: boolean
    dataUdienza?: boolean
    tipoUdienza?: boolean
    tipoUdienzaCustom?: boolean
    note?: boolean
    adempimenti?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rinvio"]>

  export type RinvioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentEventId?: boolean
    numero?: boolean
    dataUdienza?: boolean
    tipoUdienza?: boolean
    tipoUdienzaCustom?: boolean
    note?: boolean
    adempimenti?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rinvio"]>

  export type RinvioSelectScalar = {
    id?: boolean
    parentEventId?: boolean
    numero?: boolean
    dataUdienza?: boolean
    tipoUdienza?: boolean
    tipoUdienzaCustom?: boolean
    note?: boolean
    adempimenti?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RinvioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type RinvioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentEvent?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $RinvioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rinvio"
    objects: {
      parentEvent: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      parentEventId: string
      numero: number
      dataUdienza: Date
      tipoUdienza: string
      tipoUdienzaCustom: string | null
      note: string | null
      adempimenti: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rinvio"]>
    composites: {}
  }

  type RinvioGetPayload<S extends boolean | null | undefined | RinvioDefaultArgs> = $Result.GetResult<Prisma.$RinvioPayload, S>

  type RinvioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RinvioFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RinvioCountAggregateInputType | true
    }

  export interface RinvioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rinvio'], meta: { name: 'Rinvio' } }
    /**
     * Find zero or one Rinvio that matches the filter.
     * @param {RinvioFindUniqueArgs} args - Arguments to find a Rinvio
     * @example
     * // Get one Rinvio
     * const rinvio = await prisma.rinvio.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RinvioFindUniqueArgs>(args: SelectSubset<T, RinvioFindUniqueArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Rinvio that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RinvioFindUniqueOrThrowArgs} args - Arguments to find a Rinvio
     * @example
     * // Get one Rinvio
     * const rinvio = await prisma.rinvio.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RinvioFindUniqueOrThrowArgs>(args: SelectSubset<T, RinvioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Rinvio that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RinvioFindFirstArgs} args - Arguments to find a Rinvio
     * @example
     * // Get one Rinvio
     * const rinvio = await prisma.rinvio.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RinvioFindFirstArgs>(args?: SelectSubset<T, RinvioFindFirstArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Rinvio that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RinvioFindFirstOrThrowArgs} args - Arguments to find a Rinvio
     * @example
     * // Get one Rinvio
     * const rinvio = await prisma.rinvio.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RinvioFindFirstOrThrowArgs>(args?: SelectSubset<T, RinvioFindFirstOrThrowArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Rinvios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RinvioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rinvios
     * const rinvios = await prisma.rinvio.findMany()
     * 
     * // Get first 10 Rinvios
     * const rinvios = await prisma.rinvio.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rinvioWithIdOnly = await prisma.rinvio.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RinvioFindManyArgs>(args?: SelectSubset<T, RinvioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Rinvio.
     * @param {RinvioCreateArgs} args - Arguments to create a Rinvio.
     * @example
     * // Create one Rinvio
     * const Rinvio = await prisma.rinvio.create({
     *   data: {
     *     // ... data to create a Rinvio
     *   }
     * })
     * 
     */
    create<T extends RinvioCreateArgs>(args: SelectSubset<T, RinvioCreateArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Rinvios.
     * @param {RinvioCreateManyArgs} args - Arguments to create many Rinvios.
     * @example
     * // Create many Rinvios
     * const rinvio = await prisma.rinvio.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RinvioCreateManyArgs>(args?: SelectSubset<T, RinvioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rinvios and returns the data saved in the database.
     * @param {RinvioCreateManyAndReturnArgs} args - Arguments to create many Rinvios.
     * @example
     * // Create many Rinvios
     * const rinvio = await prisma.rinvio.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rinvios and only return the `id`
     * const rinvioWithIdOnly = await prisma.rinvio.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RinvioCreateManyAndReturnArgs>(args?: SelectSubset<T, RinvioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Rinvio.
     * @param {RinvioDeleteArgs} args - Arguments to delete one Rinvio.
     * @example
     * // Delete one Rinvio
     * const Rinvio = await prisma.rinvio.delete({
     *   where: {
     *     // ... filter to delete one Rinvio
     *   }
     * })
     * 
     */
    delete<T extends RinvioDeleteArgs>(args: SelectSubset<T, RinvioDeleteArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Rinvio.
     * @param {RinvioUpdateArgs} args - Arguments to update one Rinvio.
     * @example
     * // Update one Rinvio
     * const rinvio = await prisma.rinvio.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RinvioUpdateArgs>(args: SelectSubset<T, RinvioUpdateArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Rinvios.
     * @param {RinvioDeleteManyArgs} args - Arguments to filter Rinvios to delete.
     * @example
     * // Delete a few Rinvios
     * const { count } = await prisma.rinvio.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RinvioDeleteManyArgs>(args?: SelectSubset<T, RinvioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rinvios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RinvioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rinvios
     * const rinvio = await prisma.rinvio.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RinvioUpdateManyArgs>(args: SelectSubset<T, RinvioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rinvio.
     * @param {RinvioUpsertArgs} args - Arguments to update or create a Rinvio.
     * @example
     * // Update or create a Rinvio
     * const rinvio = await prisma.rinvio.upsert({
     *   create: {
     *     // ... data to create a Rinvio
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rinvio we want to update
     *   }
     * })
     */
    upsert<T extends RinvioUpsertArgs>(args: SelectSubset<T, RinvioUpsertArgs<ExtArgs>>): Prisma__RinvioClient<$Result.GetResult<Prisma.$RinvioPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Rinvios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RinvioCountArgs} args - Arguments to filter Rinvios to count.
     * @example
     * // Count the number of Rinvios
     * const count = await prisma.rinvio.count({
     *   where: {
     *     // ... the filter for the Rinvios we want to count
     *   }
     * })
    **/
    count<T extends RinvioCountArgs>(
      args?: Subset<T, RinvioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RinvioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rinvio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RinvioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RinvioAggregateArgs>(args: Subset<T, RinvioAggregateArgs>): Prisma.PrismaPromise<GetRinvioAggregateType<T>>

    /**
     * Group by Rinvio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RinvioGroupByArgs} args - Group by arguments.
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
      T extends RinvioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RinvioGroupByArgs['orderBy'] }
        : { orderBy?: RinvioGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RinvioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRinvioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rinvio model
   */
  readonly fields: RinvioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rinvio.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RinvioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parentEvent<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Rinvio model
   */ 
  interface RinvioFieldRefs {
    readonly id: FieldRef<"Rinvio", 'String'>
    readonly parentEventId: FieldRef<"Rinvio", 'String'>
    readonly numero: FieldRef<"Rinvio", 'Int'>
    readonly dataUdienza: FieldRef<"Rinvio", 'DateTime'>
    readonly tipoUdienza: FieldRef<"Rinvio", 'String'>
    readonly tipoUdienzaCustom: FieldRef<"Rinvio", 'String'>
    readonly note: FieldRef<"Rinvio", 'String'>
    readonly adempimenti: FieldRef<"Rinvio", 'String'>
    readonly createdAt: FieldRef<"Rinvio", 'DateTime'>
    readonly updatedAt: FieldRef<"Rinvio", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rinvio findUnique
   */
  export type RinvioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * Filter, which Rinvio to fetch.
     */
    where: RinvioWhereUniqueInput
  }

  /**
   * Rinvio findUniqueOrThrow
   */
  export type RinvioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * Filter, which Rinvio to fetch.
     */
    where: RinvioWhereUniqueInput
  }

  /**
   * Rinvio findFirst
   */
  export type RinvioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * Filter, which Rinvio to fetch.
     */
    where?: RinvioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rinvios to fetch.
     */
    orderBy?: RinvioOrderByWithRelationInput | RinvioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rinvios.
     */
    cursor?: RinvioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rinvios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rinvios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rinvios.
     */
    distinct?: RinvioScalarFieldEnum | RinvioScalarFieldEnum[]
  }

  /**
   * Rinvio findFirstOrThrow
   */
  export type RinvioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * Filter, which Rinvio to fetch.
     */
    where?: RinvioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rinvios to fetch.
     */
    orderBy?: RinvioOrderByWithRelationInput | RinvioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rinvios.
     */
    cursor?: RinvioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rinvios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rinvios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rinvios.
     */
    distinct?: RinvioScalarFieldEnum | RinvioScalarFieldEnum[]
  }

  /**
   * Rinvio findMany
   */
  export type RinvioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * Filter, which Rinvios to fetch.
     */
    where?: RinvioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rinvios to fetch.
     */
    orderBy?: RinvioOrderByWithRelationInput | RinvioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rinvios.
     */
    cursor?: RinvioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rinvios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rinvios.
     */
    skip?: number
    distinct?: RinvioScalarFieldEnum | RinvioScalarFieldEnum[]
  }

  /**
   * Rinvio create
   */
  export type RinvioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * The data needed to create a Rinvio.
     */
    data: XOR<RinvioCreateInput, RinvioUncheckedCreateInput>
  }

  /**
   * Rinvio createMany
   */
  export type RinvioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rinvios.
     */
    data: RinvioCreateManyInput | RinvioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rinvio createManyAndReturn
   */
  export type RinvioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Rinvios.
     */
    data: RinvioCreateManyInput | RinvioCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rinvio update
   */
  export type RinvioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * The data needed to update a Rinvio.
     */
    data: XOR<RinvioUpdateInput, RinvioUncheckedUpdateInput>
    /**
     * Choose, which Rinvio to update.
     */
    where: RinvioWhereUniqueInput
  }

  /**
   * Rinvio updateMany
   */
  export type RinvioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rinvios.
     */
    data: XOR<RinvioUpdateManyMutationInput, RinvioUncheckedUpdateManyInput>
    /**
     * Filter which Rinvios to update
     */
    where?: RinvioWhereInput
  }

  /**
   * Rinvio upsert
   */
  export type RinvioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * The filter to search for the Rinvio to update in case it exists.
     */
    where: RinvioWhereUniqueInput
    /**
     * In case the Rinvio found by the `where` argument doesn't exist, create a new Rinvio with this data.
     */
    create: XOR<RinvioCreateInput, RinvioUncheckedCreateInput>
    /**
     * In case the Rinvio was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RinvioUpdateInput, RinvioUncheckedUpdateInput>
  }

  /**
   * Rinvio delete
   */
  export type RinvioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
    /**
     * Filter which Rinvio to delete.
     */
    where: RinvioWhereUniqueInput
  }

  /**
   * Rinvio deleteMany
   */
  export type RinvioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rinvios to delete
     */
    where?: RinvioWhereInput
  }

  /**
   * Rinvio without action
   */
  export type RinvioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rinvio
     */
    select?: RinvioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RinvioInclude<ExtArgs> | null
  }


  /**
   * Model Setting
   */

  export type AggregateSetting = {
    _count: SettingCountAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  export type SettingMinAggregateOutputType = {
    id: string | null
    value: string | null
  }

  export type SettingMaxAggregateOutputType = {
    id: string | null
    value: string | null
  }

  export type SettingCountAggregateOutputType = {
    id: number
    value: number
    _all: number
  }


  export type SettingMinAggregateInputType = {
    id?: true
    value?: true
  }

  export type SettingMaxAggregateInputType = {
    id?: true
    value?: true
  }

  export type SettingCountAggregateInputType = {
    id?: true
    value?: true
    _all?: true
  }

  export type SettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Setting to aggregate.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingMaxAggregateInputType
  }

  export type GetSettingAggregateType<T extends SettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSetting[P]>
      : GetScalarType<T[P], AggregateSetting[P]>
  }




  export type SettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingWhereInput
    orderBy?: SettingOrderByWithAggregationInput | SettingOrderByWithAggregationInput[]
    by: SettingScalarFieldEnum[] | SettingScalarFieldEnum
    having?: SettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingCountAggregateInputType | true
    _min?: SettingMinAggregateInputType
    _max?: SettingMaxAggregateInputType
  }

  export type SettingGroupByOutputType = {
    id: string
    value: string
    _count: SettingCountAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  type GetSettingGroupByPayload<T extends SettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingGroupByOutputType[P]>
            : GetScalarType<T[P], SettingGroupByOutputType[P]>
        }
      >
    >


  export type SettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    value?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    value?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectScalar = {
    id?: boolean
    value?: boolean
  }


  export type $SettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Setting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      value: string
    }, ExtArgs["result"]["setting"]>
    composites: {}
  }

  type SettingGetPayload<S extends boolean | null | undefined | SettingDefaultArgs> = $Result.GetResult<Prisma.$SettingPayload, S>

  type SettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SettingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SettingCountAggregateInputType | true
    }

  export interface SettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Setting'], meta: { name: 'Setting' } }
    /**
     * Find zero or one Setting that matches the filter.
     * @param {SettingFindUniqueArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingFindUniqueArgs>(args: SelectSubset<T, SettingFindUniqueArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Setting that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SettingFindUniqueOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Setting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingFindFirstArgs>(args?: SelectSubset<T, SettingFindFirstArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Setting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.setting.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.setting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingWithIdOnly = await prisma.setting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingFindManyArgs>(args?: SelectSubset<T, SettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Setting.
     * @param {SettingCreateArgs} args - Arguments to create a Setting.
     * @example
     * // Create one Setting
     * const Setting = await prisma.setting.create({
     *   data: {
     *     // ... data to create a Setting
     *   }
     * })
     * 
     */
    create<T extends SettingCreateArgs>(args: SelectSubset<T, SettingCreateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Settings.
     * @param {SettingCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingCreateManyArgs>(args?: SelectSubset<T, SettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingWithIdOnly = await prisma.setting.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Setting.
     * @param {SettingDeleteArgs} args - Arguments to delete one Setting.
     * @example
     * // Delete one Setting
     * const Setting = await prisma.setting.delete({
     *   where: {
     *     // ... filter to delete one Setting
     *   }
     * })
     * 
     */
    delete<T extends SettingDeleteArgs>(args: SelectSubset<T, SettingDeleteArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Setting.
     * @param {SettingUpdateArgs} args - Arguments to update one Setting.
     * @example
     * // Update one Setting
     * const setting = await prisma.setting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingUpdateArgs>(args: SelectSubset<T, SettingUpdateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Settings.
     * @param {SettingDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.setting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingDeleteManyArgs>(args?: SelectSubset<T, SettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingUpdateManyArgs>(args: SelectSubset<T, SettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Setting.
     * @param {SettingUpsertArgs} args - Arguments to update or create a Setting.
     * @example
     * // Update or create a Setting
     * const setting = await prisma.setting.upsert({
     *   create: {
     *     // ... data to create a Setting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Setting we want to update
     *   }
     * })
     */
    upsert<T extends SettingUpsertArgs>(args: SelectSubset<T, SettingUpsertArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.setting.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingCountArgs>(
      args?: Subset<T, SettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SettingAggregateArgs>(args: Subset<T, SettingAggregateArgs>): Prisma.PrismaPromise<GetSettingAggregateType<T>>

    /**
     * Group by Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingGroupByArgs} args - Group by arguments.
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
      T extends SettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingGroupByArgs['orderBy'] }
        : { orderBy?: SettingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Setting model
   */
  readonly fields: SettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Setting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Setting model
   */ 
  interface SettingFieldRefs {
    readonly id: FieldRef<"Setting", 'String'>
    readonly value: FieldRef<"Setting", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Setting findUnique
   */
  export type SettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findUniqueOrThrow
   */
  export type SettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findFirst
   */
  export type SettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findFirstOrThrow
   */
  export type SettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findMany
   */
  export type SettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting create
   */
  export type SettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * The data needed to create a Setting.
     */
    data: XOR<SettingCreateInput, SettingUncheckedCreateInput>
  }

  /**
   * Setting createMany
   */
  export type SettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting createManyAndReturn
   */
  export type SettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting update
   */
  export type SettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * The data needed to update a Setting.
     */
    data: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
    /**
     * Choose, which Setting to update.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting updateMany
   */
  export type SettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
  }

  /**
   * Setting upsert
   */
  export type SettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * The filter to search for the Setting to update in case it exists.
     */
    where: SettingWhereUniqueInput
    /**
     * In case the Setting found by the `where` argument doesn't exist, create a new Setting with this data.
     */
    create: XOR<SettingCreateInput, SettingUncheckedCreateInput>
    /**
     * In case the Setting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
  }

  /**
   * Setting delete
   */
  export type SettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Filter which Setting to delete.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting deleteMany
   */
  export type SettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingWhereInput
  }

  /**
   * Setting without action
   */
  export type SettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
  }


  /**
   * Model NotificationDevice
   */

  export type AggregateNotificationDevice = {
    _count: NotificationDeviceCountAggregateOutputType | null
    _min: NotificationDeviceMinAggregateOutputType | null
    _max: NotificationDeviceMaxAggregateOutputType | null
  }

  export type NotificationDeviceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: string | null
    externalDeviceId: string | null
    pushToken: string | null
    platform: string | null
    locale: string | null
    notificationsOn: boolean | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationDeviceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: string | null
    externalDeviceId: string | null
    pushToken: string | null
    platform: string | null
    locale: string | null
    notificationsOn: boolean | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationDeviceCountAggregateOutputType = {
    id: number
    userId: number
    provider: number
    externalDeviceId: number
    pushToken: number
    platform: number
    locale: number
    notificationsOn: number
    lastSeenAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationDeviceMinAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    externalDeviceId?: true
    pushToken?: true
    platform?: true
    locale?: true
    notificationsOn?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationDeviceMaxAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    externalDeviceId?: true
    pushToken?: true
    platform?: true
    locale?: true
    notificationsOn?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationDeviceCountAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    externalDeviceId?: true
    pushToken?: true
    platform?: true
    locale?: true
    notificationsOn?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationDeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationDevice to aggregate.
     */
    where?: NotificationDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDevices to fetch.
     */
    orderBy?: NotificationDeviceOrderByWithRelationInput | NotificationDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationDevices
    **/
    _count?: true | NotificationDeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationDeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationDeviceMaxAggregateInputType
  }

  export type GetNotificationDeviceAggregateType<T extends NotificationDeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationDevice[P]>
      : GetScalarType<T[P], AggregateNotificationDevice[P]>
  }




  export type NotificationDeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationDeviceWhereInput
    orderBy?: NotificationDeviceOrderByWithAggregationInput | NotificationDeviceOrderByWithAggregationInput[]
    by: NotificationDeviceScalarFieldEnum[] | NotificationDeviceScalarFieldEnum
    having?: NotificationDeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationDeviceCountAggregateInputType | true
    _min?: NotificationDeviceMinAggregateInputType
    _max?: NotificationDeviceMaxAggregateInputType
  }

  export type NotificationDeviceGroupByOutputType = {
    id: string
    userId: string
    provider: string
    externalDeviceId: string
    pushToken: string | null
    platform: string | null
    locale: string | null
    notificationsOn: boolean
    lastSeenAt: Date
    createdAt: Date
    updatedAt: Date
    _count: NotificationDeviceCountAggregateOutputType | null
    _min: NotificationDeviceMinAggregateOutputType | null
    _max: NotificationDeviceMaxAggregateOutputType | null
  }

  type GetNotificationDeviceGroupByPayload<T extends NotificationDeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationDeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationDeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationDeviceGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationDeviceGroupByOutputType[P]>
        }
      >
    >


  export type NotificationDeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    externalDeviceId?: boolean
    pushToken?: boolean
    platform?: boolean
    locale?: boolean
    notificationsOn?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationDevice"]>

  export type NotificationDeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    externalDeviceId?: boolean
    pushToken?: boolean
    platform?: boolean
    locale?: boolean
    notificationsOn?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationDevice"]>

  export type NotificationDeviceSelectScalar = {
    id?: boolean
    userId?: boolean
    provider?: boolean
    externalDeviceId?: boolean
    pushToken?: boolean
    platform?: boolean
    locale?: boolean
    notificationsOn?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationDeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationDeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationDevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationDevice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      provider: string
      externalDeviceId: string
      pushToken: string | null
      platform: string | null
      locale: string | null
      notificationsOn: boolean
      lastSeenAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notificationDevice"]>
    composites: {}
  }

  type NotificationDeviceGetPayload<S extends boolean | null | undefined | NotificationDeviceDefaultArgs> = $Result.GetResult<Prisma.$NotificationDevicePayload, S>

  type NotificationDeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationDeviceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationDeviceCountAggregateInputType | true
    }

  export interface NotificationDeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationDevice'], meta: { name: 'NotificationDevice' } }
    /**
     * Find zero or one NotificationDevice that matches the filter.
     * @param {NotificationDeviceFindUniqueArgs} args - Arguments to find a NotificationDevice
     * @example
     * // Get one NotificationDevice
     * const notificationDevice = await prisma.notificationDevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationDeviceFindUniqueArgs>(args: SelectSubset<T, NotificationDeviceFindUniqueArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationDevice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationDeviceFindUniqueOrThrowArgs} args - Arguments to find a NotificationDevice
     * @example
     * // Get one NotificationDevice
     * const notificationDevice = await prisma.notificationDevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationDeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationDevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeviceFindFirstArgs} args - Arguments to find a NotificationDevice
     * @example
     * // Get one NotificationDevice
     * const notificationDevice = await prisma.notificationDevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationDeviceFindFirstArgs>(args?: SelectSubset<T, NotificationDeviceFindFirstArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationDevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeviceFindFirstOrThrowArgs} args - Arguments to find a NotificationDevice
     * @example
     * // Get one NotificationDevice
     * const notificationDevice = await prisma.notificationDevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationDeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationDevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationDevices
     * const notificationDevices = await prisma.notificationDevice.findMany()
     * 
     * // Get first 10 NotificationDevices
     * const notificationDevices = await prisma.notificationDevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationDeviceWithIdOnly = await prisma.notificationDevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationDeviceFindManyArgs>(args?: SelectSubset<T, NotificationDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationDevice.
     * @param {NotificationDeviceCreateArgs} args - Arguments to create a NotificationDevice.
     * @example
     * // Create one NotificationDevice
     * const NotificationDevice = await prisma.notificationDevice.create({
     *   data: {
     *     // ... data to create a NotificationDevice
     *   }
     * })
     * 
     */
    create<T extends NotificationDeviceCreateArgs>(args: SelectSubset<T, NotificationDeviceCreateArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationDevices.
     * @param {NotificationDeviceCreateManyArgs} args - Arguments to create many NotificationDevices.
     * @example
     * // Create many NotificationDevices
     * const notificationDevice = await prisma.notificationDevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationDeviceCreateManyArgs>(args?: SelectSubset<T, NotificationDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationDevices and returns the data saved in the database.
     * @param {NotificationDeviceCreateManyAndReturnArgs} args - Arguments to create many NotificationDevices.
     * @example
     * // Create many NotificationDevices
     * const notificationDevice = await prisma.notificationDevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationDevices and only return the `id`
     * const notificationDeviceWithIdOnly = await prisma.notificationDevice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationDeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationDevice.
     * @param {NotificationDeviceDeleteArgs} args - Arguments to delete one NotificationDevice.
     * @example
     * // Delete one NotificationDevice
     * const NotificationDevice = await prisma.notificationDevice.delete({
     *   where: {
     *     // ... filter to delete one NotificationDevice
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeviceDeleteArgs>(args: SelectSubset<T, NotificationDeviceDeleteArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationDevice.
     * @param {NotificationDeviceUpdateArgs} args - Arguments to update one NotificationDevice.
     * @example
     * // Update one NotificationDevice
     * const notificationDevice = await prisma.notificationDevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationDeviceUpdateArgs>(args: SelectSubset<T, NotificationDeviceUpdateArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationDevices.
     * @param {NotificationDeviceDeleteManyArgs} args - Arguments to filter NotificationDevices to delete.
     * @example
     * // Delete a few NotificationDevices
     * const { count } = await prisma.notificationDevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeviceDeleteManyArgs>(args?: SelectSubset<T, NotificationDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationDevices
     * const notificationDevice = await prisma.notificationDevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationDeviceUpdateManyArgs>(args: SelectSubset<T, NotificationDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationDevice.
     * @param {NotificationDeviceUpsertArgs} args - Arguments to update or create a NotificationDevice.
     * @example
     * // Update or create a NotificationDevice
     * const notificationDevice = await prisma.notificationDevice.upsert({
     *   create: {
     *     // ... data to create a NotificationDevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationDevice we want to update
     *   }
     * })
     */
    upsert<T extends NotificationDeviceUpsertArgs>(args: SelectSubset<T, NotificationDeviceUpsertArgs<ExtArgs>>): Prisma__NotificationDeviceClient<$Result.GetResult<Prisma.$NotificationDevicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeviceCountArgs} args - Arguments to filter NotificationDevices to count.
     * @example
     * // Count the number of NotificationDevices
     * const count = await prisma.notificationDevice.count({
     *   where: {
     *     // ... the filter for the NotificationDevices we want to count
     *   }
     * })
    **/
    count<T extends NotificationDeviceCountArgs>(
      args?: Subset<T, NotificationDeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationDeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationDeviceAggregateArgs>(args: Subset<T, NotificationDeviceAggregateArgs>): Prisma.PrismaPromise<GetNotificationDeviceAggregateType<T>>

    /**
     * Group by NotificationDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeviceGroupByArgs} args - Group by arguments.
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
      T extends NotificationDeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationDeviceGroupByArgs['orderBy'] }
        : { orderBy?: NotificationDeviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationDevice model
   */
  readonly fields: NotificationDeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationDevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationDeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the NotificationDevice model
   */ 
  interface NotificationDeviceFieldRefs {
    readonly id: FieldRef<"NotificationDevice", 'String'>
    readonly userId: FieldRef<"NotificationDevice", 'String'>
    readonly provider: FieldRef<"NotificationDevice", 'String'>
    readonly externalDeviceId: FieldRef<"NotificationDevice", 'String'>
    readonly pushToken: FieldRef<"NotificationDevice", 'String'>
    readonly platform: FieldRef<"NotificationDevice", 'String'>
    readonly locale: FieldRef<"NotificationDevice", 'String'>
    readonly notificationsOn: FieldRef<"NotificationDevice", 'Boolean'>
    readonly lastSeenAt: FieldRef<"NotificationDevice", 'DateTime'>
    readonly createdAt: FieldRef<"NotificationDevice", 'DateTime'>
    readonly updatedAt: FieldRef<"NotificationDevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationDevice findUnique
   */
  export type NotificationDeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDevice to fetch.
     */
    where: NotificationDeviceWhereUniqueInput
  }

  /**
   * NotificationDevice findUniqueOrThrow
   */
  export type NotificationDeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDevice to fetch.
     */
    where: NotificationDeviceWhereUniqueInput
  }

  /**
   * NotificationDevice findFirst
   */
  export type NotificationDeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDevice to fetch.
     */
    where?: NotificationDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDevices to fetch.
     */
    orderBy?: NotificationDeviceOrderByWithRelationInput | NotificationDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationDevices.
     */
    cursor?: NotificationDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationDevices.
     */
    distinct?: NotificationDeviceScalarFieldEnum | NotificationDeviceScalarFieldEnum[]
  }

  /**
   * NotificationDevice findFirstOrThrow
   */
  export type NotificationDeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDevice to fetch.
     */
    where?: NotificationDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDevices to fetch.
     */
    orderBy?: NotificationDeviceOrderByWithRelationInput | NotificationDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationDevices.
     */
    cursor?: NotificationDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationDevices.
     */
    distinct?: NotificationDeviceScalarFieldEnum | NotificationDeviceScalarFieldEnum[]
  }

  /**
   * NotificationDevice findMany
   */
  export type NotificationDeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDevices to fetch.
     */
    where?: NotificationDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDevices to fetch.
     */
    orderBy?: NotificationDeviceOrderByWithRelationInput | NotificationDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationDevices.
     */
    cursor?: NotificationDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDevices.
     */
    skip?: number
    distinct?: NotificationDeviceScalarFieldEnum | NotificationDeviceScalarFieldEnum[]
  }

  /**
   * NotificationDevice create
   */
  export type NotificationDeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a NotificationDevice.
     */
    data: XOR<NotificationDeviceCreateInput, NotificationDeviceUncheckedCreateInput>
  }

  /**
   * NotificationDevice createMany
   */
  export type NotificationDeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationDevices.
     */
    data: NotificationDeviceCreateManyInput | NotificationDeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationDevice createManyAndReturn
   */
  export type NotificationDeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationDevices.
     */
    data: NotificationDeviceCreateManyInput | NotificationDeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NotificationDevice update
   */
  export type NotificationDeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a NotificationDevice.
     */
    data: XOR<NotificationDeviceUpdateInput, NotificationDeviceUncheckedUpdateInput>
    /**
     * Choose, which NotificationDevice to update.
     */
    where: NotificationDeviceWhereUniqueInput
  }

  /**
   * NotificationDevice updateMany
   */
  export type NotificationDeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationDevices.
     */
    data: XOR<NotificationDeviceUpdateManyMutationInput, NotificationDeviceUncheckedUpdateManyInput>
    /**
     * Filter which NotificationDevices to update
     */
    where?: NotificationDeviceWhereInput
  }

  /**
   * NotificationDevice upsert
   */
  export type NotificationDeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the NotificationDevice to update in case it exists.
     */
    where: NotificationDeviceWhereUniqueInput
    /**
     * In case the NotificationDevice found by the `where` argument doesn't exist, create a new NotificationDevice with this data.
     */
    create: XOR<NotificationDeviceCreateInput, NotificationDeviceUncheckedCreateInput>
    /**
     * In case the NotificationDevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationDeviceUpdateInput, NotificationDeviceUncheckedUpdateInput>
  }

  /**
   * NotificationDevice delete
   */
  export type NotificationDeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
    /**
     * Filter which NotificationDevice to delete.
     */
    where: NotificationDeviceWhereUniqueInput
  }

  /**
   * NotificationDevice deleteMany
   */
  export type NotificationDeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationDevices to delete
     */
    where?: NotificationDeviceWhereInput
  }

  /**
   * NotificationDevice without action
   */
  export type NotificationDeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDevice
     */
    select?: NotificationDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeviceInclude<ExtArgs> | null
  }


  /**
   * Model EventNotificationPreference
   */

  export type AggregateEventNotificationPreference = {
    _count: EventNotificationPreferenceCountAggregateOutputType | null
    _avg: EventNotificationPreferenceAvgAggregateOutputType | null
    _sum: EventNotificationPreferenceSumAggregateOutputType | null
    _min: EventNotificationPreferenceMinAggregateOutputType | null
    _max: EventNotificationPreferenceMaxAggregateOutputType | null
  }

  export type EventNotificationPreferenceAvgAggregateOutputType = {
    notifyHoursBefore: number | null
  }

  export type EventNotificationPreferenceSumAggregateOutputType = {
    notifyHoursBefore: number | null
  }

  export type EventNotificationPreferenceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    eventType: string | null
    macroArea: string | null
    enabled: boolean | null
    notifyHoursBefore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventNotificationPreferenceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    eventType: string | null
    macroArea: string | null
    enabled: boolean | null
    notifyHoursBefore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventNotificationPreferenceCountAggregateOutputType = {
    id: number
    userId: number
    eventType: number
    macroArea: number
    enabled: number
    notifyHoursBefore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventNotificationPreferenceAvgAggregateInputType = {
    notifyHoursBefore?: true
  }

  export type EventNotificationPreferenceSumAggregateInputType = {
    notifyHoursBefore?: true
  }

  export type EventNotificationPreferenceMinAggregateInputType = {
    id?: true
    userId?: true
    eventType?: true
    macroArea?: true
    enabled?: true
    notifyHoursBefore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventNotificationPreferenceMaxAggregateInputType = {
    id?: true
    userId?: true
    eventType?: true
    macroArea?: true
    enabled?: true
    notifyHoursBefore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventNotificationPreferenceCountAggregateInputType = {
    id?: true
    userId?: true
    eventType?: true
    macroArea?: true
    enabled?: true
    notifyHoursBefore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventNotificationPreferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventNotificationPreference to aggregate.
     */
    where?: EventNotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventNotificationPreferences to fetch.
     */
    orderBy?: EventNotificationPreferenceOrderByWithRelationInput | EventNotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventNotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventNotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventNotificationPreferences
    **/
    _count?: true | EventNotificationPreferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventNotificationPreferenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventNotificationPreferenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventNotificationPreferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventNotificationPreferenceMaxAggregateInputType
  }

  export type GetEventNotificationPreferenceAggregateType<T extends EventNotificationPreferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateEventNotificationPreference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventNotificationPreference[P]>
      : GetScalarType<T[P], AggregateEventNotificationPreference[P]>
  }




  export type EventNotificationPreferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventNotificationPreferenceWhereInput
    orderBy?: EventNotificationPreferenceOrderByWithAggregationInput | EventNotificationPreferenceOrderByWithAggregationInput[]
    by: EventNotificationPreferenceScalarFieldEnum[] | EventNotificationPreferenceScalarFieldEnum
    having?: EventNotificationPreferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventNotificationPreferenceCountAggregateInputType | true
    _avg?: EventNotificationPreferenceAvgAggregateInputType
    _sum?: EventNotificationPreferenceSumAggregateInputType
    _min?: EventNotificationPreferenceMinAggregateInputType
    _max?: EventNotificationPreferenceMaxAggregateInputType
  }

  export type EventNotificationPreferenceGroupByOutputType = {
    id: string
    userId: string
    eventType: string | null
    macroArea: string | null
    enabled: boolean
    notifyHoursBefore: number | null
    createdAt: Date
    updatedAt: Date
    _count: EventNotificationPreferenceCountAggregateOutputType | null
    _avg: EventNotificationPreferenceAvgAggregateOutputType | null
    _sum: EventNotificationPreferenceSumAggregateOutputType | null
    _min: EventNotificationPreferenceMinAggregateOutputType | null
    _max: EventNotificationPreferenceMaxAggregateOutputType | null
  }

  type GetEventNotificationPreferenceGroupByPayload<T extends EventNotificationPreferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventNotificationPreferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventNotificationPreferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventNotificationPreferenceGroupByOutputType[P]>
            : GetScalarType<T[P], EventNotificationPreferenceGroupByOutputType[P]>
        }
      >
    >


  export type EventNotificationPreferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    eventType?: boolean
    macroArea?: boolean
    enabled?: boolean
    notifyHoursBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventNotificationPreference"]>

  export type EventNotificationPreferenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    eventType?: boolean
    macroArea?: boolean
    enabled?: boolean
    notifyHoursBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventNotificationPreference"]>

  export type EventNotificationPreferenceSelectScalar = {
    id?: boolean
    userId?: boolean
    eventType?: boolean
    macroArea?: boolean
    enabled?: boolean
    notifyHoursBefore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventNotificationPreferenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EventNotificationPreferenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EventNotificationPreferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventNotificationPreference"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      eventType: string | null
      macroArea: string | null
      enabled: boolean
      notifyHoursBefore: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["eventNotificationPreference"]>
    composites: {}
  }

  type EventNotificationPreferenceGetPayload<S extends boolean | null | undefined | EventNotificationPreferenceDefaultArgs> = $Result.GetResult<Prisma.$EventNotificationPreferencePayload, S>

  type EventNotificationPreferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventNotificationPreferenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventNotificationPreferenceCountAggregateInputType | true
    }

  export interface EventNotificationPreferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventNotificationPreference'], meta: { name: 'EventNotificationPreference' } }
    /**
     * Find zero or one EventNotificationPreference that matches the filter.
     * @param {EventNotificationPreferenceFindUniqueArgs} args - Arguments to find a EventNotificationPreference
     * @example
     * // Get one EventNotificationPreference
     * const eventNotificationPreference = await prisma.eventNotificationPreference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventNotificationPreferenceFindUniqueArgs>(args: SelectSubset<T, EventNotificationPreferenceFindUniqueArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EventNotificationPreference that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventNotificationPreferenceFindUniqueOrThrowArgs} args - Arguments to find a EventNotificationPreference
     * @example
     * // Get one EventNotificationPreference
     * const eventNotificationPreference = await prisma.eventNotificationPreference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventNotificationPreferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, EventNotificationPreferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EventNotificationPreference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationPreferenceFindFirstArgs} args - Arguments to find a EventNotificationPreference
     * @example
     * // Get one EventNotificationPreference
     * const eventNotificationPreference = await prisma.eventNotificationPreference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventNotificationPreferenceFindFirstArgs>(args?: SelectSubset<T, EventNotificationPreferenceFindFirstArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EventNotificationPreference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationPreferenceFindFirstOrThrowArgs} args - Arguments to find a EventNotificationPreference
     * @example
     * // Get one EventNotificationPreference
     * const eventNotificationPreference = await prisma.eventNotificationPreference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventNotificationPreferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, EventNotificationPreferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EventNotificationPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationPreferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventNotificationPreferences
     * const eventNotificationPreferences = await prisma.eventNotificationPreference.findMany()
     * 
     * // Get first 10 EventNotificationPreferences
     * const eventNotificationPreferences = await prisma.eventNotificationPreference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventNotificationPreferenceWithIdOnly = await prisma.eventNotificationPreference.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventNotificationPreferenceFindManyArgs>(args?: SelectSubset<T, EventNotificationPreferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EventNotificationPreference.
     * @param {EventNotificationPreferenceCreateArgs} args - Arguments to create a EventNotificationPreference.
     * @example
     * // Create one EventNotificationPreference
     * const EventNotificationPreference = await prisma.eventNotificationPreference.create({
     *   data: {
     *     // ... data to create a EventNotificationPreference
     *   }
     * })
     * 
     */
    create<T extends EventNotificationPreferenceCreateArgs>(args: SelectSubset<T, EventNotificationPreferenceCreateArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EventNotificationPreferences.
     * @param {EventNotificationPreferenceCreateManyArgs} args - Arguments to create many EventNotificationPreferences.
     * @example
     * // Create many EventNotificationPreferences
     * const eventNotificationPreference = await prisma.eventNotificationPreference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventNotificationPreferenceCreateManyArgs>(args?: SelectSubset<T, EventNotificationPreferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventNotificationPreferences and returns the data saved in the database.
     * @param {EventNotificationPreferenceCreateManyAndReturnArgs} args - Arguments to create many EventNotificationPreferences.
     * @example
     * // Create many EventNotificationPreferences
     * const eventNotificationPreference = await prisma.eventNotificationPreference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventNotificationPreferences and only return the `id`
     * const eventNotificationPreferenceWithIdOnly = await prisma.eventNotificationPreference.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventNotificationPreferenceCreateManyAndReturnArgs>(args?: SelectSubset<T, EventNotificationPreferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EventNotificationPreference.
     * @param {EventNotificationPreferenceDeleteArgs} args - Arguments to delete one EventNotificationPreference.
     * @example
     * // Delete one EventNotificationPreference
     * const EventNotificationPreference = await prisma.eventNotificationPreference.delete({
     *   where: {
     *     // ... filter to delete one EventNotificationPreference
     *   }
     * })
     * 
     */
    delete<T extends EventNotificationPreferenceDeleteArgs>(args: SelectSubset<T, EventNotificationPreferenceDeleteArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EventNotificationPreference.
     * @param {EventNotificationPreferenceUpdateArgs} args - Arguments to update one EventNotificationPreference.
     * @example
     * // Update one EventNotificationPreference
     * const eventNotificationPreference = await prisma.eventNotificationPreference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventNotificationPreferenceUpdateArgs>(args: SelectSubset<T, EventNotificationPreferenceUpdateArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EventNotificationPreferences.
     * @param {EventNotificationPreferenceDeleteManyArgs} args - Arguments to filter EventNotificationPreferences to delete.
     * @example
     * // Delete a few EventNotificationPreferences
     * const { count } = await prisma.eventNotificationPreference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventNotificationPreferenceDeleteManyArgs>(args?: SelectSubset<T, EventNotificationPreferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventNotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationPreferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventNotificationPreferences
     * const eventNotificationPreference = await prisma.eventNotificationPreference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventNotificationPreferenceUpdateManyArgs>(args: SelectSubset<T, EventNotificationPreferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventNotificationPreference.
     * @param {EventNotificationPreferenceUpsertArgs} args - Arguments to update or create a EventNotificationPreference.
     * @example
     * // Update or create a EventNotificationPreference
     * const eventNotificationPreference = await prisma.eventNotificationPreference.upsert({
     *   create: {
     *     // ... data to create a EventNotificationPreference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventNotificationPreference we want to update
     *   }
     * })
     */
    upsert<T extends EventNotificationPreferenceUpsertArgs>(args: SelectSubset<T, EventNotificationPreferenceUpsertArgs<ExtArgs>>): Prisma__EventNotificationPreferenceClient<$Result.GetResult<Prisma.$EventNotificationPreferencePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EventNotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationPreferenceCountArgs} args - Arguments to filter EventNotificationPreferences to count.
     * @example
     * // Count the number of EventNotificationPreferences
     * const count = await prisma.eventNotificationPreference.count({
     *   where: {
     *     // ... the filter for the EventNotificationPreferences we want to count
     *   }
     * })
    **/
    count<T extends EventNotificationPreferenceCountArgs>(
      args?: Subset<T, EventNotificationPreferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventNotificationPreferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventNotificationPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationPreferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EventNotificationPreferenceAggregateArgs>(args: Subset<T, EventNotificationPreferenceAggregateArgs>): Prisma.PrismaPromise<GetEventNotificationPreferenceAggregateType<T>>

    /**
     * Group by EventNotificationPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventNotificationPreferenceGroupByArgs} args - Group by arguments.
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
      T extends EventNotificationPreferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventNotificationPreferenceGroupByArgs['orderBy'] }
        : { orderBy?: EventNotificationPreferenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EventNotificationPreferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventNotificationPreferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventNotificationPreference model
   */
  readonly fields: EventNotificationPreferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventNotificationPreference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventNotificationPreferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the EventNotificationPreference model
   */ 
  interface EventNotificationPreferenceFieldRefs {
    readonly id: FieldRef<"EventNotificationPreference", 'String'>
    readonly userId: FieldRef<"EventNotificationPreference", 'String'>
    readonly eventType: FieldRef<"EventNotificationPreference", 'String'>
    readonly macroArea: FieldRef<"EventNotificationPreference", 'String'>
    readonly enabled: FieldRef<"EventNotificationPreference", 'Boolean'>
    readonly notifyHoursBefore: FieldRef<"EventNotificationPreference", 'Int'>
    readonly createdAt: FieldRef<"EventNotificationPreference", 'DateTime'>
    readonly updatedAt: FieldRef<"EventNotificationPreference", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventNotificationPreference findUnique
   */
  export type EventNotificationPreferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which EventNotificationPreference to fetch.
     */
    where: EventNotificationPreferenceWhereUniqueInput
  }

  /**
   * EventNotificationPreference findUniqueOrThrow
   */
  export type EventNotificationPreferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which EventNotificationPreference to fetch.
     */
    where: EventNotificationPreferenceWhereUniqueInput
  }

  /**
   * EventNotificationPreference findFirst
   */
  export type EventNotificationPreferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which EventNotificationPreference to fetch.
     */
    where?: EventNotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventNotificationPreferences to fetch.
     */
    orderBy?: EventNotificationPreferenceOrderByWithRelationInput | EventNotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventNotificationPreferences.
     */
    cursor?: EventNotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventNotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventNotificationPreferences.
     */
    distinct?: EventNotificationPreferenceScalarFieldEnum | EventNotificationPreferenceScalarFieldEnum[]
  }

  /**
   * EventNotificationPreference findFirstOrThrow
   */
  export type EventNotificationPreferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which EventNotificationPreference to fetch.
     */
    where?: EventNotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventNotificationPreferences to fetch.
     */
    orderBy?: EventNotificationPreferenceOrderByWithRelationInput | EventNotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventNotificationPreferences.
     */
    cursor?: EventNotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventNotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventNotificationPreferences.
     */
    distinct?: EventNotificationPreferenceScalarFieldEnum | EventNotificationPreferenceScalarFieldEnum[]
  }

  /**
   * EventNotificationPreference findMany
   */
  export type EventNotificationPreferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * Filter, which EventNotificationPreferences to fetch.
     */
    where?: EventNotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventNotificationPreferences to fetch.
     */
    orderBy?: EventNotificationPreferenceOrderByWithRelationInput | EventNotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventNotificationPreferences.
     */
    cursor?: EventNotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventNotificationPreferences.
     */
    skip?: number
    distinct?: EventNotificationPreferenceScalarFieldEnum | EventNotificationPreferenceScalarFieldEnum[]
  }

  /**
   * EventNotificationPreference create
   */
  export type EventNotificationPreferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * The data needed to create a EventNotificationPreference.
     */
    data: XOR<EventNotificationPreferenceCreateInput, EventNotificationPreferenceUncheckedCreateInput>
  }

  /**
   * EventNotificationPreference createMany
   */
  export type EventNotificationPreferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventNotificationPreferences.
     */
    data: EventNotificationPreferenceCreateManyInput | EventNotificationPreferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventNotificationPreference createManyAndReturn
   */
  export type EventNotificationPreferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EventNotificationPreferences.
     */
    data: EventNotificationPreferenceCreateManyInput | EventNotificationPreferenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventNotificationPreference update
   */
  export type EventNotificationPreferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * The data needed to update a EventNotificationPreference.
     */
    data: XOR<EventNotificationPreferenceUpdateInput, EventNotificationPreferenceUncheckedUpdateInput>
    /**
     * Choose, which EventNotificationPreference to update.
     */
    where: EventNotificationPreferenceWhereUniqueInput
  }

  /**
   * EventNotificationPreference updateMany
   */
  export type EventNotificationPreferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventNotificationPreferences.
     */
    data: XOR<EventNotificationPreferenceUpdateManyMutationInput, EventNotificationPreferenceUncheckedUpdateManyInput>
    /**
     * Filter which EventNotificationPreferences to update
     */
    where?: EventNotificationPreferenceWhereInput
  }

  /**
   * EventNotificationPreference upsert
   */
  export type EventNotificationPreferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * The filter to search for the EventNotificationPreference to update in case it exists.
     */
    where: EventNotificationPreferenceWhereUniqueInput
    /**
     * In case the EventNotificationPreference found by the `where` argument doesn't exist, create a new EventNotificationPreference with this data.
     */
    create: XOR<EventNotificationPreferenceCreateInput, EventNotificationPreferenceUncheckedCreateInput>
    /**
     * In case the EventNotificationPreference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventNotificationPreferenceUpdateInput, EventNotificationPreferenceUncheckedUpdateInput>
  }

  /**
   * EventNotificationPreference delete
   */
  export type EventNotificationPreferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
    /**
     * Filter which EventNotificationPreference to delete.
     */
    where: EventNotificationPreferenceWhereUniqueInput
  }

  /**
   * EventNotificationPreference deleteMany
   */
  export type EventNotificationPreferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventNotificationPreferences to delete
     */
    where?: EventNotificationPreferenceWhereInput
  }

  /**
   * EventNotificationPreference without action
   */
  export type EventNotificationPreferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventNotificationPreference
     */
    select?: EventNotificationPreferenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventNotificationPreferenceInclude<ExtArgs> | null
  }


  /**
   * Model CalendarShare
   */

  export type AggregateCalendarShare = {
    _count: CalendarShareCountAggregateOutputType | null
    _min: CalendarShareMinAggregateOutputType | null
    _max: CalendarShareMaxAggregateOutputType | null
  }

  export type CalendarShareMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    sharedWithId: string | null
    permission: $Enums.SharePermission | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CalendarShareMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    sharedWithId: string | null
    permission: $Enums.SharePermission | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CalendarShareCountAggregateOutputType = {
    id: number
    ownerId: number
    sharedWithId: number
    permission: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CalendarShareMinAggregateInputType = {
    id?: true
    ownerId?: true
    sharedWithId?: true
    permission?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CalendarShareMaxAggregateInputType = {
    id?: true
    ownerId?: true
    sharedWithId?: true
    permission?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CalendarShareCountAggregateInputType = {
    id?: true
    ownerId?: true
    sharedWithId?: true
    permission?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CalendarShareAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CalendarShare to aggregate.
     */
    where?: CalendarShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarShares to fetch.
     */
    orderBy?: CalendarShareOrderByWithRelationInput | CalendarShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CalendarShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarShares.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CalendarShares
    **/
    _count?: true | CalendarShareCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CalendarShareMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CalendarShareMaxAggregateInputType
  }

  export type GetCalendarShareAggregateType<T extends CalendarShareAggregateArgs> = {
        [P in keyof T & keyof AggregateCalendarShare]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCalendarShare[P]>
      : GetScalarType<T[P], AggregateCalendarShare[P]>
  }




  export type CalendarShareGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalendarShareWhereInput
    orderBy?: CalendarShareOrderByWithAggregationInput | CalendarShareOrderByWithAggregationInput[]
    by: CalendarShareScalarFieldEnum[] | CalendarShareScalarFieldEnum
    having?: CalendarShareScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CalendarShareCountAggregateInputType | true
    _min?: CalendarShareMinAggregateInputType
    _max?: CalendarShareMaxAggregateInputType
  }

  export type CalendarShareGroupByOutputType = {
    id: string
    ownerId: string
    sharedWithId: string
    permission: $Enums.SharePermission
    createdAt: Date
    updatedAt: Date
    _count: CalendarShareCountAggregateOutputType | null
    _min: CalendarShareMinAggregateOutputType | null
    _max: CalendarShareMaxAggregateOutputType | null
  }

  type GetCalendarShareGroupByPayload<T extends CalendarShareGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CalendarShareGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CalendarShareGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CalendarShareGroupByOutputType[P]>
            : GetScalarType<T[P], CalendarShareGroupByOutputType[P]>
        }
      >
    >


  export type CalendarShareSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    sharedWithId?: boolean
    permission?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calendarShare"]>

  export type CalendarShareSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    sharedWithId?: boolean
    permission?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calendarShare"]>

  export type CalendarShareSelectScalar = {
    id?: boolean
    ownerId?: boolean
    sharedWithId?: boolean
    permission?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CalendarShareInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CalendarShareIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CalendarSharePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CalendarShare"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      sharedWith: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      sharedWithId: string
      permission: $Enums.SharePermission
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["calendarShare"]>
    composites: {}
  }

  type CalendarShareGetPayload<S extends boolean | null | undefined | CalendarShareDefaultArgs> = $Result.GetResult<Prisma.$CalendarSharePayload, S>

  type CalendarShareCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CalendarShareFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CalendarShareCountAggregateInputType | true
    }

  export interface CalendarShareDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CalendarShare'], meta: { name: 'CalendarShare' } }
    /**
     * Find zero or one CalendarShare that matches the filter.
     * @param {CalendarShareFindUniqueArgs} args - Arguments to find a CalendarShare
     * @example
     * // Get one CalendarShare
     * const calendarShare = await prisma.calendarShare.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CalendarShareFindUniqueArgs>(args: SelectSubset<T, CalendarShareFindUniqueArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CalendarShare that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CalendarShareFindUniqueOrThrowArgs} args - Arguments to find a CalendarShare
     * @example
     * // Get one CalendarShare
     * const calendarShare = await prisma.calendarShare.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CalendarShareFindUniqueOrThrowArgs>(args: SelectSubset<T, CalendarShareFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CalendarShare that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarShareFindFirstArgs} args - Arguments to find a CalendarShare
     * @example
     * // Get one CalendarShare
     * const calendarShare = await prisma.calendarShare.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CalendarShareFindFirstArgs>(args?: SelectSubset<T, CalendarShareFindFirstArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CalendarShare that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarShareFindFirstOrThrowArgs} args - Arguments to find a CalendarShare
     * @example
     * // Get one CalendarShare
     * const calendarShare = await prisma.calendarShare.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CalendarShareFindFirstOrThrowArgs>(args?: SelectSubset<T, CalendarShareFindFirstOrThrowArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CalendarShares that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarShareFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CalendarShares
     * const calendarShares = await prisma.calendarShare.findMany()
     * 
     * // Get first 10 CalendarShares
     * const calendarShares = await prisma.calendarShare.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const calendarShareWithIdOnly = await prisma.calendarShare.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CalendarShareFindManyArgs>(args?: SelectSubset<T, CalendarShareFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CalendarShare.
     * @param {CalendarShareCreateArgs} args - Arguments to create a CalendarShare.
     * @example
     * // Create one CalendarShare
     * const CalendarShare = await prisma.calendarShare.create({
     *   data: {
     *     // ... data to create a CalendarShare
     *   }
     * })
     * 
     */
    create<T extends CalendarShareCreateArgs>(args: SelectSubset<T, CalendarShareCreateArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CalendarShares.
     * @param {CalendarShareCreateManyArgs} args - Arguments to create many CalendarShares.
     * @example
     * // Create many CalendarShares
     * const calendarShare = await prisma.calendarShare.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CalendarShareCreateManyArgs>(args?: SelectSubset<T, CalendarShareCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CalendarShares and returns the data saved in the database.
     * @param {CalendarShareCreateManyAndReturnArgs} args - Arguments to create many CalendarShares.
     * @example
     * // Create many CalendarShares
     * const calendarShare = await prisma.calendarShare.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CalendarShares and only return the `id`
     * const calendarShareWithIdOnly = await prisma.calendarShare.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CalendarShareCreateManyAndReturnArgs>(args?: SelectSubset<T, CalendarShareCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CalendarShare.
     * @param {CalendarShareDeleteArgs} args - Arguments to delete one CalendarShare.
     * @example
     * // Delete one CalendarShare
     * const CalendarShare = await prisma.calendarShare.delete({
     *   where: {
     *     // ... filter to delete one CalendarShare
     *   }
     * })
     * 
     */
    delete<T extends CalendarShareDeleteArgs>(args: SelectSubset<T, CalendarShareDeleteArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CalendarShare.
     * @param {CalendarShareUpdateArgs} args - Arguments to update one CalendarShare.
     * @example
     * // Update one CalendarShare
     * const calendarShare = await prisma.calendarShare.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CalendarShareUpdateArgs>(args: SelectSubset<T, CalendarShareUpdateArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CalendarShares.
     * @param {CalendarShareDeleteManyArgs} args - Arguments to filter CalendarShares to delete.
     * @example
     * // Delete a few CalendarShares
     * const { count } = await prisma.calendarShare.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CalendarShareDeleteManyArgs>(args?: SelectSubset<T, CalendarShareDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CalendarShares.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarShareUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CalendarShares
     * const calendarShare = await prisma.calendarShare.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CalendarShareUpdateManyArgs>(args: SelectSubset<T, CalendarShareUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CalendarShare.
     * @param {CalendarShareUpsertArgs} args - Arguments to update or create a CalendarShare.
     * @example
     * // Update or create a CalendarShare
     * const calendarShare = await prisma.calendarShare.upsert({
     *   create: {
     *     // ... data to create a CalendarShare
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CalendarShare we want to update
     *   }
     * })
     */
    upsert<T extends CalendarShareUpsertArgs>(args: SelectSubset<T, CalendarShareUpsertArgs<ExtArgs>>): Prisma__CalendarShareClient<$Result.GetResult<Prisma.$CalendarSharePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CalendarShares.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarShareCountArgs} args - Arguments to filter CalendarShares to count.
     * @example
     * // Count the number of CalendarShares
     * const count = await prisma.calendarShare.count({
     *   where: {
     *     // ... the filter for the CalendarShares we want to count
     *   }
     * })
    **/
    count<T extends CalendarShareCountArgs>(
      args?: Subset<T, CalendarShareCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CalendarShareCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CalendarShare.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarShareAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CalendarShareAggregateArgs>(args: Subset<T, CalendarShareAggregateArgs>): Prisma.PrismaPromise<GetCalendarShareAggregateType<T>>

    /**
     * Group by CalendarShare.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarShareGroupByArgs} args - Group by arguments.
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
      T extends CalendarShareGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CalendarShareGroupByArgs['orderBy'] }
        : { orderBy?: CalendarShareGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CalendarShareGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCalendarShareGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CalendarShare model
   */
  readonly fields: CalendarShareFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CalendarShare.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CalendarShareClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sharedWith<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the CalendarShare model
   */ 
  interface CalendarShareFieldRefs {
    readonly id: FieldRef<"CalendarShare", 'String'>
    readonly ownerId: FieldRef<"CalendarShare", 'String'>
    readonly sharedWithId: FieldRef<"CalendarShare", 'String'>
    readonly permission: FieldRef<"CalendarShare", 'SharePermission'>
    readonly createdAt: FieldRef<"CalendarShare", 'DateTime'>
    readonly updatedAt: FieldRef<"CalendarShare", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CalendarShare findUnique
   */
  export type CalendarShareFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * Filter, which CalendarShare to fetch.
     */
    where: CalendarShareWhereUniqueInput
  }

  /**
   * CalendarShare findUniqueOrThrow
   */
  export type CalendarShareFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * Filter, which CalendarShare to fetch.
     */
    where: CalendarShareWhereUniqueInput
  }

  /**
   * CalendarShare findFirst
   */
  export type CalendarShareFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * Filter, which CalendarShare to fetch.
     */
    where?: CalendarShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarShares to fetch.
     */
    orderBy?: CalendarShareOrderByWithRelationInput | CalendarShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CalendarShares.
     */
    cursor?: CalendarShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarShares.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CalendarShares.
     */
    distinct?: CalendarShareScalarFieldEnum | CalendarShareScalarFieldEnum[]
  }

  /**
   * CalendarShare findFirstOrThrow
   */
  export type CalendarShareFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * Filter, which CalendarShare to fetch.
     */
    where?: CalendarShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarShares to fetch.
     */
    orderBy?: CalendarShareOrderByWithRelationInput | CalendarShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CalendarShares.
     */
    cursor?: CalendarShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarShares.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CalendarShares.
     */
    distinct?: CalendarShareScalarFieldEnum | CalendarShareScalarFieldEnum[]
  }

  /**
   * CalendarShare findMany
   */
  export type CalendarShareFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * Filter, which CalendarShares to fetch.
     */
    where?: CalendarShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarShares to fetch.
     */
    orderBy?: CalendarShareOrderByWithRelationInput | CalendarShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CalendarShares.
     */
    cursor?: CalendarShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarShares.
     */
    skip?: number
    distinct?: CalendarShareScalarFieldEnum | CalendarShareScalarFieldEnum[]
  }

  /**
   * CalendarShare create
   */
  export type CalendarShareCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * The data needed to create a CalendarShare.
     */
    data: XOR<CalendarShareCreateInput, CalendarShareUncheckedCreateInput>
  }

  /**
   * CalendarShare createMany
   */
  export type CalendarShareCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CalendarShares.
     */
    data: CalendarShareCreateManyInput | CalendarShareCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CalendarShare createManyAndReturn
   */
  export type CalendarShareCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CalendarShares.
     */
    data: CalendarShareCreateManyInput | CalendarShareCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CalendarShare update
   */
  export type CalendarShareUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * The data needed to update a CalendarShare.
     */
    data: XOR<CalendarShareUpdateInput, CalendarShareUncheckedUpdateInput>
    /**
     * Choose, which CalendarShare to update.
     */
    where: CalendarShareWhereUniqueInput
  }

  /**
   * CalendarShare updateMany
   */
  export type CalendarShareUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CalendarShares.
     */
    data: XOR<CalendarShareUpdateManyMutationInput, CalendarShareUncheckedUpdateManyInput>
    /**
     * Filter which CalendarShares to update
     */
    where?: CalendarShareWhereInput
  }

  /**
   * CalendarShare upsert
   */
  export type CalendarShareUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * The filter to search for the CalendarShare to update in case it exists.
     */
    where: CalendarShareWhereUniqueInput
    /**
     * In case the CalendarShare found by the `where` argument doesn't exist, create a new CalendarShare with this data.
     */
    create: XOR<CalendarShareCreateInput, CalendarShareUncheckedCreateInput>
    /**
     * In case the CalendarShare was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CalendarShareUpdateInput, CalendarShareUncheckedUpdateInput>
  }

  /**
   * CalendarShare delete
   */
  export type CalendarShareDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
    /**
     * Filter which CalendarShare to delete.
     */
    where: CalendarShareWhereUniqueInput
  }

  /**
   * CalendarShare deleteMany
   */
  export type CalendarShareDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CalendarShares to delete
     */
    where?: CalendarShareWhereInput
  }

  /**
   * CalendarShare without action
   */
  export type CalendarShareDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarShare
     */
    select?: CalendarShareSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarShareInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    clerkUserId: 'clerkUserId',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    startAt: 'startAt',
    endAt: 'endAt',
    type: 'type',
    tags: 'tags',
    caseId: 'caseId',
    notes: 'notes',
    generateSubEvents: 'generateSubEvents',
    ruleTemplateId: 'ruleTemplateId',
    ruleParams: 'ruleParams',
    macroType: 'macroType',
    macroArea: 'macroArea',
    procedimento: 'procedimento',
    parteProcessuale: 'parteProcessuale',
    eventoCode: 'eventoCode',
    inputs: 'inputs',
    color: 'color',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    orgId: 'orgId'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const SubEventScalarFieldEnum: {
    id: 'id',
    parentEventId: 'parentEventId',
    title: 'title',
    kind: 'kind',
    dueAt: 'dueAt',
    status: 'status',
    priority: 'priority',
    ruleId: 'ruleId',
    ruleParams: 'ruleParams',
    explanation: 'explanation',
    createdBy: 'createdBy',
    locked: 'locked',
    isPlaceholder: 'isPlaceholder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubEventScalarFieldEnum = (typeof SubEventScalarFieldEnum)[keyof typeof SubEventScalarFieldEnum]


  export const RinvioScalarFieldEnum: {
    id: 'id',
    parentEventId: 'parentEventId',
    numero: 'numero',
    dataUdienza: 'dataUdienza',
    tipoUdienza: 'tipoUdienza',
    tipoUdienzaCustom: 'tipoUdienzaCustom',
    note: 'note',
    adempimenti: 'adempimenti',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RinvioScalarFieldEnum = (typeof RinvioScalarFieldEnum)[keyof typeof RinvioScalarFieldEnum]


  export const SettingScalarFieldEnum: {
    id: 'id',
    value: 'value'
  };

  export type SettingScalarFieldEnum = (typeof SettingScalarFieldEnum)[keyof typeof SettingScalarFieldEnum]


  export const NotificationDeviceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    provider: 'provider',
    externalDeviceId: 'externalDeviceId',
    pushToken: 'pushToken',
    platform: 'platform',
    locale: 'locale',
    notificationsOn: 'notificationsOn',
    lastSeenAt: 'lastSeenAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NotificationDeviceScalarFieldEnum = (typeof NotificationDeviceScalarFieldEnum)[keyof typeof NotificationDeviceScalarFieldEnum]


  export const EventNotificationPreferenceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    eventType: 'eventType',
    macroArea: 'macroArea',
    enabled: 'enabled',
    notifyHoursBefore: 'notifyHoursBefore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventNotificationPreferenceScalarFieldEnum = (typeof EventNotificationPreferenceScalarFieldEnum)[keyof typeof EventNotificationPreferenceScalarFieldEnum]


  export const CalendarShareScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    sharedWithId: 'sharedWithId',
    permission: 'permission',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CalendarShareScalarFieldEnum = (typeof CalendarShareScalarFieldEnum)[keyof typeof CalendarShareScalarFieldEnum]


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
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'SharePermission'
   */
  export type EnumSharePermissionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SharePermission'>
    


  /**
   * Reference to a field of type 'SharePermission[]'
   */
  export type ListEnumSharePermissionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SharePermission[]'>
    


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


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    clerkUserId?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    events?: EventListRelationFilter
    notificationDevices?: NotificationDeviceListRelationFilter
    eventNotificationPrefs?: EventNotificationPreferenceListRelationFilter
    sharedByMe?: CalendarShareListRelationFilter
    sharedWithMe?: CalendarShareListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    clerkUserId?: SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    events?: EventOrderByRelationAggregateInput
    notificationDevices?: NotificationDeviceOrderByRelationAggregateInput
    eventNotificationPrefs?: EventNotificationPreferenceOrderByRelationAggregateInput
    sharedByMe?: CalendarShareOrderByRelationAggregateInput
    sharedWithMe?: CalendarShareOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clerkUserId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    events?: EventListRelationFilter
    notificationDevices?: NotificationDeviceListRelationFilter
    eventNotificationPrefs?: EventNotificationPreferenceListRelationFilter
    sharedByMe?: CalendarShareListRelationFilter
    sharedWithMe?: CalendarShareListRelationFilter
  }, "id" | "clerkUserId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    clerkUserId?: SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    clerkUserId?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    startAt?: DateTimeFilter<"Event"> | Date | string
    endAt?: DateTimeFilter<"Event"> | Date | string
    type?: StringFilter<"Event"> | string
    tags?: StringFilter<"Event"> | string
    caseId?: StringNullableFilter<"Event"> | string | null
    notes?: StringNullableFilter<"Event"> | string | null
    generateSubEvents?: BoolFilter<"Event"> | boolean
    ruleTemplateId?: StringNullableFilter<"Event"> | string | null
    ruleParams?: StringNullableFilter<"Event"> | string | null
    macroType?: StringNullableFilter<"Event"> | string | null
    macroArea?: StringNullableFilter<"Event"> | string | null
    procedimento?: StringNullableFilter<"Event"> | string | null
    parteProcessuale?: StringNullableFilter<"Event"> | string | null
    eventoCode?: StringNullableFilter<"Event"> | string | null
    inputs?: StringNullableFilter<"Event"> | string | null
    color?: StringNullableFilter<"Event"> | string | null
    status?: StringFilter<"Event"> | string
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    userId?: StringFilter<"Event"> | string
    orgId?: StringNullableFilter<"Event"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    subEvents?: SubEventListRelationFilter
    rinvii?: RinvioListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    caseId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    generateSubEvents?: SortOrder
    ruleTemplateId?: SortOrderInput | SortOrder
    ruleParams?: SortOrderInput | SortOrder
    macroType?: SortOrderInput | SortOrder
    macroArea?: SortOrderInput | SortOrder
    procedimento?: SortOrderInput | SortOrder
    parteProcessuale?: SortOrderInput | SortOrder
    eventoCode?: SortOrderInput | SortOrder
    inputs?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    orgId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    subEvents?: SubEventOrderByRelationAggregateInput
    rinvii?: RinvioOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    title?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    startAt?: DateTimeFilter<"Event"> | Date | string
    endAt?: DateTimeFilter<"Event"> | Date | string
    type?: StringFilter<"Event"> | string
    tags?: StringFilter<"Event"> | string
    caseId?: StringNullableFilter<"Event"> | string | null
    notes?: StringNullableFilter<"Event"> | string | null
    generateSubEvents?: BoolFilter<"Event"> | boolean
    ruleTemplateId?: StringNullableFilter<"Event"> | string | null
    ruleParams?: StringNullableFilter<"Event"> | string | null
    macroType?: StringNullableFilter<"Event"> | string | null
    macroArea?: StringNullableFilter<"Event"> | string | null
    procedimento?: StringNullableFilter<"Event"> | string | null
    parteProcessuale?: StringNullableFilter<"Event"> | string | null
    eventoCode?: StringNullableFilter<"Event"> | string | null
    inputs?: StringNullableFilter<"Event"> | string | null
    color?: StringNullableFilter<"Event"> | string | null
    status?: StringFilter<"Event"> | string
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    userId?: StringFilter<"Event"> | string
    orgId?: StringNullableFilter<"Event"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    subEvents?: SubEventListRelationFilter
    rinvii?: RinvioListRelationFilter
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    caseId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    generateSubEvents?: SortOrder
    ruleTemplateId?: SortOrderInput | SortOrder
    ruleParams?: SortOrderInput | SortOrder
    macroType?: SortOrderInput | SortOrder
    macroArea?: SortOrderInput | SortOrder
    procedimento?: SortOrderInput | SortOrder
    parteProcessuale?: SortOrderInput | SortOrder
    eventoCode?: SortOrderInput | SortOrder
    inputs?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    orgId?: SortOrderInput | SortOrder
    _count?: EventCountOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    title?: StringWithAggregatesFilter<"Event"> | string
    description?: StringNullableWithAggregatesFilter<"Event"> | string | null
    startAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    endAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    type?: StringWithAggregatesFilter<"Event"> | string
    tags?: StringWithAggregatesFilter<"Event"> | string
    caseId?: StringNullableWithAggregatesFilter<"Event"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Event"> | string | null
    generateSubEvents?: BoolWithAggregatesFilter<"Event"> | boolean
    ruleTemplateId?: StringNullableWithAggregatesFilter<"Event"> | string | null
    ruleParams?: StringNullableWithAggregatesFilter<"Event"> | string | null
    macroType?: StringNullableWithAggregatesFilter<"Event"> | string | null
    macroArea?: StringNullableWithAggregatesFilter<"Event"> | string | null
    procedimento?: StringNullableWithAggregatesFilter<"Event"> | string | null
    parteProcessuale?: StringNullableWithAggregatesFilter<"Event"> | string | null
    eventoCode?: StringNullableWithAggregatesFilter<"Event"> | string | null
    inputs?: StringNullableWithAggregatesFilter<"Event"> | string | null
    color?: StringNullableWithAggregatesFilter<"Event"> | string | null
    status?: StringWithAggregatesFilter<"Event"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    userId?: StringWithAggregatesFilter<"Event"> | string
    orgId?: StringNullableWithAggregatesFilter<"Event"> | string | null
  }

  export type SubEventWhereInput = {
    AND?: SubEventWhereInput | SubEventWhereInput[]
    OR?: SubEventWhereInput[]
    NOT?: SubEventWhereInput | SubEventWhereInput[]
    id?: StringFilter<"SubEvent"> | string
    parentEventId?: StringFilter<"SubEvent"> | string
    title?: StringFilter<"SubEvent"> | string
    kind?: StringFilter<"SubEvent"> | string
    dueAt?: DateTimeNullableFilter<"SubEvent"> | Date | string | null
    status?: StringFilter<"SubEvent"> | string
    priority?: IntFilter<"SubEvent"> | number
    ruleId?: StringNullableFilter<"SubEvent"> | string | null
    ruleParams?: StringNullableFilter<"SubEvent"> | string | null
    explanation?: StringNullableFilter<"SubEvent"> | string | null
    createdBy?: StringFilter<"SubEvent"> | string
    locked?: BoolFilter<"SubEvent"> | boolean
    isPlaceholder?: BoolFilter<"SubEvent"> | boolean
    createdAt?: DateTimeFilter<"SubEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SubEvent"> | Date | string
    parentEvent?: XOR<EventRelationFilter, EventWhereInput>
  }

  export type SubEventOrderByWithRelationInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    title?: SortOrder
    kind?: SortOrder
    dueAt?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    ruleId?: SortOrderInput | SortOrder
    ruleParams?: SortOrderInput | SortOrder
    explanation?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    locked?: SortOrder
    isPlaceholder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentEvent?: EventOrderByWithRelationInput
  }

  export type SubEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubEventWhereInput | SubEventWhereInput[]
    OR?: SubEventWhereInput[]
    NOT?: SubEventWhereInput | SubEventWhereInput[]
    parentEventId?: StringFilter<"SubEvent"> | string
    title?: StringFilter<"SubEvent"> | string
    kind?: StringFilter<"SubEvent"> | string
    dueAt?: DateTimeNullableFilter<"SubEvent"> | Date | string | null
    status?: StringFilter<"SubEvent"> | string
    priority?: IntFilter<"SubEvent"> | number
    ruleId?: StringNullableFilter<"SubEvent"> | string | null
    ruleParams?: StringNullableFilter<"SubEvent"> | string | null
    explanation?: StringNullableFilter<"SubEvent"> | string | null
    createdBy?: StringFilter<"SubEvent"> | string
    locked?: BoolFilter<"SubEvent"> | boolean
    isPlaceholder?: BoolFilter<"SubEvent"> | boolean
    createdAt?: DateTimeFilter<"SubEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SubEvent"> | Date | string
    parentEvent?: XOR<EventRelationFilter, EventWhereInput>
  }, "id">

  export type SubEventOrderByWithAggregationInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    title?: SortOrder
    kind?: SortOrder
    dueAt?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    ruleId?: SortOrderInput | SortOrder
    ruleParams?: SortOrderInput | SortOrder
    explanation?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    locked?: SortOrder
    isPlaceholder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubEventCountOrderByAggregateInput
    _avg?: SubEventAvgOrderByAggregateInput
    _max?: SubEventMaxOrderByAggregateInput
    _min?: SubEventMinOrderByAggregateInput
    _sum?: SubEventSumOrderByAggregateInput
  }

  export type SubEventScalarWhereWithAggregatesInput = {
    AND?: SubEventScalarWhereWithAggregatesInput | SubEventScalarWhereWithAggregatesInput[]
    OR?: SubEventScalarWhereWithAggregatesInput[]
    NOT?: SubEventScalarWhereWithAggregatesInput | SubEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubEvent"> | string
    parentEventId?: StringWithAggregatesFilter<"SubEvent"> | string
    title?: StringWithAggregatesFilter<"SubEvent"> | string
    kind?: StringWithAggregatesFilter<"SubEvent"> | string
    dueAt?: DateTimeNullableWithAggregatesFilter<"SubEvent"> | Date | string | null
    status?: StringWithAggregatesFilter<"SubEvent"> | string
    priority?: IntWithAggregatesFilter<"SubEvent"> | number
    ruleId?: StringNullableWithAggregatesFilter<"SubEvent"> | string | null
    ruleParams?: StringNullableWithAggregatesFilter<"SubEvent"> | string | null
    explanation?: StringNullableWithAggregatesFilter<"SubEvent"> | string | null
    createdBy?: StringWithAggregatesFilter<"SubEvent"> | string
    locked?: BoolWithAggregatesFilter<"SubEvent"> | boolean
    isPlaceholder?: BoolWithAggregatesFilter<"SubEvent"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SubEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SubEvent"> | Date | string
  }

  export type RinvioWhereInput = {
    AND?: RinvioWhereInput | RinvioWhereInput[]
    OR?: RinvioWhereInput[]
    NOT?: RinvioWhereInput | RinvioWhereInput[]
    id?: StringFilter<"Rinvio"> | string
    parentEventId?: StringFilter<"Rinvio"> | string
    numero?: IntFilter<"Rinvio"> | number
    dataUdienza?: DateTimeFilter<"Rinvio"> | Date | string
    tipoUdienza?: StringFilter<"Rinvio"> | string
    tipoUdienzaCustom?: StringNullableFilter<"Rinvio"> | string | null
    note?: StringNullableFilter<"Rinvio"> | string | null
    adempimenti?: StringFilter<"Rinvio"> | string
    createdAt?: DateTimeFilter<"Rinvio"> | Date | string
    updatedAt?: DateTimeFilter<"Rinvio"> | Date | string
    parentEvent?: XOR<EventRelationFilter, EventWhereInput>
  }

  export type RinvioOrderByWithRelationInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    numero?: SortOrder
    dataUdienza?: SortOrder
    tipoUdienza?: SortOrder
    tipoUdienzaCustom?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    adempimenti?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parentEvent?: EventOrderByWithRelationInput
  }

  export type RinvioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RinvioWhereInput | RinvioWhereInput[]
    OR?: RinvioWhereInput[]
    NOT?: RinvioWhereInput | RinvioWhereInput[]
    parentEventId?: StringFilter<"Rinvio"> | string
    numero?: IntFilter<"Rinvio"> | number
    dataUdienza?: DateTimeFilter<"Rinvio"> | Date | string
    tipoUdienza?: StringFilter<"Rinvio"> | string
    tipoUdienzaCustom?: StringNullableFilter<"Rinvio"> | string | null
    note?: StringNullableFilter<"Rinvio"> | string | null
    adempimenti?: StringFilter<"Rinvio"> | string
    createdAt?: DateTimeFilter<"Rinvio"> | Date | string
    updatedAt?: DateTimeFilter<"Rinvio"> | Date | string
    parentEvent?: XOR<EventRelationFilter, EventWhereInput>
  }, "id">

  export type RinvioOrderByWithAggregationInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    numero?: SortOrder
    dataUdienza?: SortOrder
    tipoUdienza?: SortOrder
    tipoUdienzaCustom?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    adempimenti?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RinvioCountOrderByAggregateInput
    _avg?: RinvioAvgOrderByAggregateInput
    _max?: RinvioMaxOrderByAggregateInput
    _min?: RinvioMinOrderByAggregateInput
    _sum?: RinvioSumOrderByAggregateInput
  }

  export type RinvioScalarWhereWithAggregatesInput = {
    AND?: RinvioScalarWhereWithAggregatesInput | RinvioScalarWhereWithAggregatesInput[]
    OR?: RinvioScalarWhereWithAggregatesInput[]
    NOT?: RinvioScalarWhereWithAggregatesInput | RinvioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Rinvio"> | string
    parentEventId?: StringWithAggregatesFilter<"Rinvio"> | string
    numero?: IntWithAggregatesFilter<"Rinvio"> | number
    dataUdienza?: DateTimeWithAggregatesFilter<"Rinvio"> | Date | string
    tipoUdienza?: StringWithAggregatesFilter<"Rinvio"> | string
    tipoUdienzaCustom?: StringNullableWithAggregatesFilter<"Rinvio"> | string | null
    note?: StringNullableWithAggregatesFilter<"Rinvio"> | string | null
    adempimenti?: StringWithAggregatesFilter<"Rinvio"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Rinvio"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Rinvio"> | Date | string
  }

  export type SettingWhereInput = {
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    id?: StringFilter<"Setting"> | string
    value?: StringFilter<"Setting"> | string
  }

  export type SettingOrderByWithRelationInput = {
    id?: SortOrder
    value?: SortOrder
  }

  export type SettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    value?: StringFilter<"Setting"> | string
  }, "id">

  export type SettingOrderByWithAggregationInput = {
    id?: SortOrder
    value?: SortOrder
    _count?: SettingCountOrderByAggregateInput
    _max?: SettingMaxOrderByAggregateInput
    _min?: SettingMinOrderByAggregateInput
  }

  export type SettingScalarWhereWithAggregatesInput = {
    AND?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    OR?: SettingScalarWhereWithAggregatesInput[]
    NOT?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Setting"> | string
    value?: StringWithAggregatesFilter<"Setting"> | string
  }

  export type NotificationDeviceWhereInput = {
    AND?: NotificationDeviceWhereInput | NotificationDeviceWhereInput[]
    OR?: NotificationDeviceWhereInput[]
    NOT?: NotificationDeviceWhereInput | NotificationDeviceWhereInput[]
    id?: StringFilter<"NotificationDevice"> | string
    userId?: StringFilter<"NotificationDevice"> | string
    provider?: StringFilter<"NotificationDevice"> | string
    externalDeviceId?: StringFilter<"NotificationDevice"> | string
    pushToken?: StringNullableFilter<"NotificationDevice"> | string | null
    platform?: StringNullableFilter<"NotificationDevice"> | string | null
    locale?: StringNullableFilter<"NotificationDevice"> | string | null
    notificationsOn?: BoolFilter<"NotificationDevice"> | boolean
    lastSeenAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    createdAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type NotificationDeviceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    externalDeviceId?: SortOrder
    pushToken?: SortOrderInput | SortOrder
    platform?: SortOrderInput | SortOrder
    locale?: SortOrderInput | SortOrder
    notificationsOn?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_externalDeviceId?: NotificationDeviceProviderExternalDeviceIdCompoundUniqueInput
    AND?: NotificationDeviceWhereInput | NotificationDeviceWhereInput[]
    OR?: NotificationDeviceWhereInput[]
    NOT?: NotificationDeviceWhereInput | NotificationDeviceWhereInput[]
    userId?: StringFilter<"NotificationDevice"> | string
    provider?: StringFilter<"NotificationDevice"> | string
    externalDeviceId?: StringFilter<"NotificationDevice"> | string
    pushToken?: StringNullableFilter<"NotificationDevice"> | string | null
    platform?: StringNullableFilter<"NotificationDevice"> | string | null
    locale?: StringNullableFilter<"NotificationDevice"> | string | null
    notificationsOn?: BoolFilter<"NotificationDevice"> | boolean
    lastSeenAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    createdAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "provider_externalDeviceId">

  export type NotificationDeviceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    externalDeviceId?: SortOrder
    pushToken?: SortOrderInput | SortOrder
    platform?: SortOrderInput | SortOrder
    locale?: SortOrderInput | SortOrder
    notificationsOn?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationDeviceCountOrderByAggregateInput
    _max?: NotificationDeviceMaxOrderByAggregateInput
    _min?: NotificationDeviceMinOrderByAggregateInput
  }

  export type NotificationDeviceScalarWhereWithAggregatesInput = {
    AND?: NotificationDeviceScalarWhereWithAggregatesInput | NotificationDeviceScalarWhereWithAggregatesInput[]
    OR?: NotificationDeviceScalarWhereWithAggregatesInput[]
    NOT?: NotificationDeviceScalarWhereWithAggregatesInput | NotificationDeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NotificationDevice"> | string
    userId?: StringWithAggregatesFilter<"NotificationDevice"> | string
    provider?: StringWithAggregatesFilter<"NotificationDevice"> | string
    externalDeviceId?: StringWithAggregatesFilter<"NotificationDevice"> | string
    pushToken?: StringNullableWithAggregatesFilter<"NotificationDevice"> | string | null
    platform?: StringNullableWithAggregatesFilter<"NotificationDevice"> | string | null
    locale?: StringNullableWithAggregatesFilter<"NotificationDevice"> | string | null
    notificationsOn?: BoolWithAggregatesFilter<"NotificationDevice"> | boolean
    lastSeenAt?: DateTimeWithAggregatesFilter<"NotificationDevice"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"NotificationDevice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NotificationDevice"> | Date | string
  }

  export type EventNotificationPreferenceWhereInput = {
    AND?: EventNotificationPreferenceWhereInput | EventNotificationPreferenceWhereInput[]
    OR?: EventNotificationPreferenceWhereInput[]
    NOT?: EventNotificationPreferenceWhereInput | EventNotificationPreferenceWhereInput[]
    id?: StringFilter<"EventNotificationPreference"> | string
    userId?: StringFilter<"EventNotificationPreference"> | string
    eventType?: StringNullableFilter<"EventNotificationPreference"> | string | null
    macroArea?: StringNullableFilter<"EventNotificationPreference"> | string | null
    enabled?: BoolFilter<"EventNotificationPreference"> | boolean
    notifyHoursBefore?: IntNullableFilter<"EventNotificationPreference"> | number | null
    createdAt?: DateTimeFilter<"EventNotificationPreference"> | Date | string
    updatedAt?: DateTimeFilter<"EventNotificationPreference"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type EventNotificationPreferenceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    eventType?: SortOrderInput | SortOrder
    macroArea?: SortOrderInput | SortOrder
    enabled?: SortOrder
    notifyHoursBefore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type EventNotificationPreferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventNotificationPreferenceWhereInput | EventNotificationPreferenceWhereInput[]
    OR?: EventNotificationPreferenceWhereInput[]
    NOT?: EventNotificationPreferenceWhereInput | EventNotificationPreferenceWhereInput[]
    userId?: StringFilter<"EventNotificationPreference"> | string
    eventType?: StringNullableFilter<"EventNotificationPreference"> | string | null
    macroArea?: StringNullableFilter<"EventNotificationPreference"> | string | null
    enabled?: BoolFilter<"EventNotificationPreference"> | boolean
    notifyHoursBefore?: IntNullableFilter<"EventNotificationPreference"> | number | null
    createdAt?: DateTimeFilter<"EventNotificationPreference"> | Date | string
    updatedAt?: DateTimeFilter<"EventNotificationPreference"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type EventNotificationPreferenceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    eventType?: SortOrderInput | SortOrder
    macroArea?: SortOrderInput | SortOrder
    enabled?: SortOrder
    notifyHoursBefore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventNotificationPreferenceCountOrderByAggregateInput
    _avg?: EventNotificationPreferenceAvgOrderByAggregateInput
    _max?: EventNotificationPreferenceMaxOrderByAggregateInput
    _min?: EventNotificationPreferenceMinOrderByAggregateInput
    _sum?: EventNotificationPreferenceSumOrderByAggregateInput
  }

  export type EventNotificationPreferenceScalarWhereWithAggregatesInput = {
    AND?: EventNotificationPreferenceScalarWhereWithAggregatesInput | EventNotificationPreferenceScalarWhereWithAggregatesInput[]
    OR?: EventNotificationPreferenceScalarWhereWithAggregatesInput[]
    NOT?: EventNotificationPreferenceScalarWhereWithAggregatesInput | EventNotificationPreferenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EventNotificationPreference"> | string
    userId?: StringWithAggregatesFilter<"EventNotificationPreference"> | string
    eventType?: StringNullableWithAggregatesFilter<"EventNotificationPreference"> | string | null
    macroArea?: StringNullableWithAggregatesFilter<"EventNotificationPreference"> | string | null
    enabled?: BoolWithAggregatesFilter<"EventNotificationPreference"> | boolean
    notifyHoursBefore?: IntNullableWithAggregatesFilter<"EventNotificationPreference"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"EventNotificationPreference"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EventNotificationPreference"> | Date | string
  }

  export type CalendarShareWhereInput = {
    AND?: CalendarShareWhereInput | CalendarShareWhereInput[]
    OR?: CalendarShareWhereInput[]
    NOT?: CalendarShareWhereInput | CalendarShareWhereInput[]
    id?: StringFilter<"CalendarShare"> | string
    ownerId?: StringFilter<"CalendarShare"> | string
    sharedWithId?: StringFilter<"CalendarShare"> | string
    permission?: EnumSharePermissionFilter<"CalendarShare"> | $Enums.SharePermission
    createdAt?: DateTimeFilter<"CalendarShare"> | Date | string
    updatedAt?: DateTimeFilter<"CalendarShare"> | Date | string
    owner?: XOR<UserRelationFilter, UserWhereInput>
    sharedWith?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type CalendarShareOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    permission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    sharedWith?: UserOrderByWithRelationInput
  }

  export type CalendarShareWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ownerId_sharedWithId?: CalendarShareOwnerIdSharedWithIdCompoundUniqueInput
    AND?: CalendarShareWhereInput | CalendarShareWhereInput[]
    OR?: CalendarShareWhereInput[]
    NOT?: CalendarShareWhereInput | CalendarShareWhereInput[]
    ownerId?: StringFilter<"CalendarShare"> | string
    sharedWithId?: StringFilter<"CalendarShare"> | string
    permission?: EnumSharePermissionFilter<"CalendarShare"> | $Enums.SharePermission
    createdAt?: DateTimeFilter<"CalendarShare"> | Date | string
    updatedAt?: DateTimeFilter<"CalendarShare"> | Date | string
    owner?: XOR<UserRelationFilter, UserWhereInput>
    sharedWith?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "ownerId_sharedWithId">

  export type CalendarShareOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    permission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CalendarShareCountOrderByAggregateInput
    _max?: CalendarShareMaxOrderByAggregateInput
    _min?: CalendarShareMinOrderByAggregateInput
  }

  export type CalendarShareScalarWhereWithAggregatesInput = {
    AND?: CalendarShareScalarWhereWithAggregatesInput | CalendarShareScalarWhereWithAggregatesInput[]
    OR?: CalendarShareScalarWhereWithAggregatesInput[]
    NOT?: CalendarShareScalarWhereWithAggregatesInput | CalendarShareScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CalendarShare"> | string
    ownerId?: StringWithAggregatesFilter<"CalendarShare"> | string
    sharedWithId?: StringWithAggregatesFilter<"CalendarShare"> | string
    permission?: EnumSharePermissionWithAggregatesFilter<"CalendarShare"> | $Enums.SharePermission
    createdAt?: DateTimeWithAggregatesFilter<"CalendarShare"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CalendarShare"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceUncheckedCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareUncheckedCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUncheckedUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUncheckedUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    orgId?: string | null
    user: UserCreateNestedOneWithoutEventsInput
    subEvents?: SubEventCreateNestedManyWithoutParentEventInput
    rinvii?: RinvioCreateNestedManyWithoutParentEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    orgId?: string | null
    subEvents?: SubEventUncheckedCreateNestedManyWithoutParentEventInput
    rinvii?: RinvioUncheckedCreateNestedManyWithoutParentEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    subEvents?: SubEventUpdateManyWithoutParentEventNestedInput
    rinvii?: RinvioUpdateManyWithoutParentEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    subEvents?: SubEventUncheckedUpdateManyWithoutParentEventNestedInput
    rinvii?: RinvioUncheckedUpdateManyWithoutParentEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    orgId?: string | null
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubEventCreateInput = {
    id?: string
    title: string
    kind: string
    dueAt?: Date | string | null
    status?: string
    priority?: number
    ruleId?: string | null
    ruleParams?: string | null
    explanation?: string | null
    createdBy?: string
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parentEvent: EventCreateNestedOneWithoutSubEventsInput
  }

  export type SubEventUncheckedCreateInput = {
    id?: string
    parentEventId: string
    title: string
    kind: string
    dueAt?: Date | string | null
    status?: string
    priority?: number
    ruleId?: string | null
    ruleParams?: string | null
    explanation?: string | null
    createdBy?: string
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    locked?: BoolFieldUpdateOperationsInput | boolean
    isPlaceholder?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentEvent?: EventUpdateOneRequiredWithoutSubEventsNestedInput
  }

  export type SubEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentEventId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    locked?: BoolFieldUpdateOperationsInput | boolean
    isPlaceholder?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubEventCreateManyInput = {
    id?: string
    parentEventId: string
    title: string
    kind: string
    dueAt?: Date | string | null
    status?: string
    priority?: number
    ruleId?: string | null
    ruleParams?: string | null
    explanation?: string | null
    createdBy?: string
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    locked?: BoolFieldUpdateOperationsInput | boolean
    isPlaceholder?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentEventId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    locked?: BoolFieldUpdateOperationsInput | boolean
    isPlaceholder?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RinvioCreateInput = {
    id?: string
    numero: number
    dataUdienza: Date | string
    tipoUdienza: string
    tipoUdienzaCustom?: string | null
    note?: string | null
    adempimenti?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parentEvent: EventCreateNestedOneWithoutRinviiInput
  }

  export type RinvioUncheckedCreateInput = {
    id?: string
    parentEventId: string
    numero: number
    dataUdienza: Date | string
    tipoUdienza: string
    tipoUdienzaCustom?: string | null
    note?: string | null
    adempimenti?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RinvioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    dataUdienza?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoUdienza?: StringFieldUpdateOperationsInput | string
    tipoUdienzaCustom?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    adempimenti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentEvent?: EventUpdateOneRequiredWithoutRinviiNestedInput
  }

  export type RinvioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentEventId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    dataUdienza?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoUdienza?: StringFieldUpdateOperationsInput | string
    tipoUdienzaCustom?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    adempimenti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RinvioCreateManyInput = {
    id?: string
    parentEventId: string
    numero: number
    dataUdienza: Date | string
    tipoUdienza: string
    tipoUdienzaCustom?: string | null
    note?: string | null
    adempimenti?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RinvioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    dataUdienza?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoUdienza?: StringFieldUpdateOperationsInput | string
    tipoUdienzaCustom?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    adempimenti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RinvioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentEventId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    dataUdienza?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoUdienza?: StringFieldUpdateOperationsInput | string
    tipoUdienzaCustom?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    adempimenti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingCreateInput = {
    id: string
    value: string
  }

  export type SettingUncheckedCreateInput = {
    id: string
    value: string
  }

  export type SettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingCreateManyInput = {
    id: string
    value: string
  }

  export type SettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationDeviceCreateInput = {
    id?: string
    provider?: string
    externalDeviceId: string
    pushToken?: string | null
    platform?: string | null
    locale?: string | null
    notificationsOn?: boolean
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationDevicesInput
  }

  export type NotificationDeviceUncheckedCreateInput = {
    id?: string
    userId: string
    provider?: string
    externalDeviceId: string
    pushToken?: string | null
    platform?: string | null
    locale?: string | null
    notificationsOn?: boolean
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    externalDeviceId?: StringFieldUpdateOperationsInput | string
    pushToken?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    notificationsOn?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationDevicesNestedInput
  }

  export type NotificationDeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    externalDeviceId?: StringFieldUpdateOperationsInput | string
    pushToken?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    notificationsOn?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeviceCreateManyInput = {
    id?: string
    userId: string
    provider?: string
    externalDeviceId: string
    pushToken?: string | null
    platform?: string | null
    locale?: string | null
    notificationsOn?: boolean
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    externalDeviceId?: StringFieldUpdateOperationsInput | string
    pushToken?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    notificationsOn?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    externalDeviceId?: StringFieldUpdateOperationsInput | string
    pushToken?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    notificationsOn?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventNotificationPreferenceCreateInput = {
    id?: string
    eventType?: string | null
    macroArea?: string | null
    enabled?: boolean
    notifyHoursBefore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutEventNotificationPrefsInput
  }

  export type EventNotificationPreferenceUncheckedCreateInput = {
    id?: string
    userId: string
    eventType?: string | null
    macroArea?: string | null
    enabled?: boolean
    notifyHoursBefore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventNotificationPreferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    notifyHoursBefore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutEventNotificationPrefsNestedInput
  }

  export type EventNotificationPreferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    notifyHoursBefore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventNotificationPreferenceCreateManyInput = {
    id?: string
    userId: string
    eventType?: string | null
    macroArea?: string | null
    enabled?: boolean
    notifyHoursBefore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventNotificationPreferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    notifyHoursBefore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventNotificationPreferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    notifyHoursBefore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarShareCreateInput = {
    id?: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutSharedByMeInput
    sharedWith: UserCreateNestedOneWithoutSharedWithMeInput
  }

  export type CalendarShareUncheckedCreateInput = {
    id?: string
    ownerId: string
    sharedWithId: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarShareUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutSharedByMeNestedInput
    sharedWith?: UserUpdateOneRequiredWithoutSharedWithMeNestedInput
  }

  export type CalendarShareUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarShareCreateManyInput = {
    id?: string
    ownerId: string
    sharedWithId: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarShareUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarShareUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type NotificationDeviceListRelationFilter = {
    every?: NotificationDeviceWhereInput
    some?: NotificationDeviceWhereInput
    none?: NotificationDeviceWhereInput
  }

  export type EventNotificationPreferenceListRelationFilter = {
    every?: EventNotificationPreferenceWhereInput
    some?: EventNotificationPreferenceWhereInput
    none?: EventNotificationPreferenceWhereInput
  }

  export type CalendarShareListRelationFilter = {
    every?: CalendarShareWhereInput
    some?: CalendarShareWhereInput
    none?: CalendarShareWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationDeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventNotificationPreferenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CalendarShareOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    clerkUserId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    clerkUserId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    clerkUserId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SubEventListRelationFilter = {
    every?: SubEventWhereInput
    some?: SubEventWhereInput
    none?: SubEventWhereInput
  }

  export type RinvioListRelationFilter = {
    every?: RinvioWhereInput
    some?: RinvioWhereInput
    none?: RinvioWhereInput
  }

  export type SubEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RinvioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    caseId?: SortOrder
    notes?: SortOrder
    generateSubEvents?: SortOrder
    ruleTemplateId?: SortOrder
    ruleParams?: SortOrder
    macroType?: SortOrder
    macroArea?: SortOrder
    procedimento?: SortOrder
    parteProcessuale?: SortOrder
    eventoCode?: SortOrder
    inputs?: SortOrder
    color?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    caseId?: SortOrder
    notes?: SortOrder
    generateSubEvents?: SortOrder
    ruleTemplateId?: SortOrder
    ruleParams?: SortOrder
    macroType?: SortOrder
    macroArea?: SortOrder
    procedimento?: SortOrder
    parteProcessuale?: SortOrder
    eventoCode?: SortOrder
    inputs?: SortOrder
    color?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    caseId?: SortOrder
    notes?: SortOrder
    generateSubEvents?: SortOrder
    ruleTemplateId?: SortOrder
    ruleParams?: SortOrder
    macroType?: SortOrder
    macroArea?: SortOrder
    procedimento?: SortOrder
    parteProcessuale?: SortOrder
    eventoCode?: SortOrder
    inputs?: SortOrder
    color?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EventRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type SubEventCountOrderByAggregateInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    title?: SortOrder
    kind?: SortOrder
    dueAt?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    ruleId?: SortOrder
    ruleParams?: SortOrder
    explanation?: SortOrder
    createdBy?: SortOrder
    locked?: SortOrder
    isPlaceholder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubEventAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type SubEventMaxOrderByAggregateInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    title?: SortOrder
    kind?: SortOrder
    dueAt?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    ruleId?: SortOrder
    ruleParams?: SortOrder
    explanation?: SortOrder
    createdBy?: SortOrder
    locked?: SortOrder
    isPlaceholder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubEventMinOrderByAggregateInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    title?: SortOrder
    kind?: SortOrder
    dueAt?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    ruleId?: SortOrder
    ruleParams?: SortOrder
    explanation?: SortOrder
    createdBy?: SortOrder
    locked?: SortOrder
    isPlaceholder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubEventSumOrderByAggregateInput = {
    priority?: SortOrder
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

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type RinvioCountOrderByAggregateInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    numero?: SortOrder
    dataUdienza?: SortOrder
    tipoUdienza?: SortOrder
    tipoUdienzaCustom?: SortOrder
    note?: SortOrder
    adempimenti?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RinvioAvgOrderByAggregateInput = {
    numero?: SortOrder
  }

  export type RinvioMaxOrderByAggregateInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    numero?: SortOrder
    dataUdienza?: SortOrder
    tipoUdienza?: SortOrder
    tipoUdienzaCustom?: SortOrder
    note?: SortOrder
    adempimenti?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RinvioMinOrderByAggregateInput = {
    id?: SortOrder
    parentEventId?: SortOrder
    numero?: SortOrder
    dataUdienza?: SortOrder
    tipoUdienza?: SortOrder
    tipoUdienzaCustom?: SortOrder
    note?: SortOrder
    adempimenti?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RinvioSumOrderByAggregateInput = {
    numero?: SortOrder
  }

  export type SettingCountOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
  }

  export type SettingMaxOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
  }

  export type SettingMinOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
  }

  export type NotificationDeviceProviderExternalDeviceIdCompoundUniqueInput = {
    provider: string
    externalDeviceId: string
  }

  export type NotificationDeviceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    externalDeviceId?: SortOrder
    pushToken?: SortOrder
    platform?: SortOrder
    locale?: SortOrder
    notificationsOn?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationDeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    externalDeviceId?: SortOrder
    pushToken?: SortOrder
    platform?: SortOrder
    locale?: SortOrder
    notificationsOn?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationDeviceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    externalDeviceId?: SortOrder
    pushToken?: SortOrder
    platform?: SortOrder
    locale?: SortOrder
    notificationsOn?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EventNotificationPreferenceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    eventType?: SortOrder
    macroArea?: SortOrder
    enabled?: SortOrder
    notifyHoursBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventNotificationPreferenceAvgOrderByAggregateInput = {
    notifyHoursBefore?: SortOrder
  }

  export type EventNotificationPreferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    eventType?: SortOrder
    macroArea?: SortOrder
    enabled?: SortOrder
    notifyHoursBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventNotificationPreferenceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    eventType?: SortOrder
    macroArea?: SortOrder
    enabled?: SortOrder
    notifyHoursBefore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventNotificationPreferenceSumOrderByAggregateInput = {
    notifyHoursBefore?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumSharePermissionFilter<$PrismaModel = never> = {
    equals?: $Enums.SharePermission | EnumSharePermissionFieldRefInput<$PrismaModel>
    in?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    notIn?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    not?: NestedEnumSharePermissionFilter<$PrismaModel> | $Enums.SharePermission
  }

  export type CalendarShareOwnerIdSharedWithIdCompoundUniqueInput = {
    ownerId: string
    sharedWithId: string
  }

  export type CalendarShareCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    permission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CalendarShareMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    permission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CalendarShareMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    permission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSharePermissionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SharePermission | EnumSharePermissionFieldRefInput<$PrismaModel>
    in?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    notIn?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    not?: NestedEnumSharePermissionWithAggregatesFilter<$PrismaModel> | $Enums.SharePermission
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSharePermissionFilter<$PrismaModel>
    _max?: NestedEnumSharePermissionFilter<$PrismaModel>
  }

  export type EventCreateNestedManyWithoutUserInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type NotificationDeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationDeviceCreateWithoutUserInput, NotificationDeviceUncheckedCreateWithoutUserInput> | NotificationDeviceCreateWithoutUserInput[] | NotificationDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationDeviceCreateOrConnectWithoutUserInput | NotificationDeviceCreateOrConnectWithoutUserInput[]
    createMany?: NotificationDeviceCreateManyUserInputEnvelope
    connect?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
  }

  export type EventNotificationPreferenceCreateNestedManyWithoutUserInput = {
    create?: XOR<EventNotificationPreferenceCreateWithoutUserInput, EventNotificationPreferenceUncheckedCreateWithoutUserInput> | EventNotificationPreferenceCreateWithoutUserInput[] | EventNotificationPreferenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventNotificationPreferenceCreateOrConnectWithoutUserInput | EventNotificationPreferenceCreateOrConnectWithoutUserInput[]
    createMany?: EventNotificationPreferenceCreateManyUserInputEnvelope
    connect?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
  }

  export type CalendarShareCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CalendarShareCreateWithoutOwnerInput, CalendarShareUncheckedCreateWithoutOwnerInput> | CalendarShareCreateWithoutOwnerInput[] | CalendarShareUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutOwnerInput | CalendarShareCreateOrConnectWithoutOwnerInput[]
    createMany?: CalendarShareCreateManyOwnerInputEnvelope
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
  }

  export type CalendarShareCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<CalendarShareCreateWithoutSharedWithInput, CalendarShareUncheckedCreateWithoutSharedWithInput> | CalendarShareCreateWithoutSharedWithInput[] | CalendarShareUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutSharedWithInput | CalendarShareCreateOrConnectWithoutSharedWithInput[]
    createMany?: CalendarShareCreateManySharedWithInputEnvelope
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type NotificationDeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationDeviceCreateWithoutUserInput, NotificationDeviceUncheckedCreateWithoutUserInput> | NotificationDeviceCreateWithoutUserInput[] | NotificationDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationDeviceCreateOrConnectWithoutUserInput | NotificationDeviceCreateOrConnectWithoutUserInput[]
    createMany?: NotificationDeviceCreateManyUserInputEnvelope
    connect?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
  }

  export type EventNotificationPreferenceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EventNotificationPreferenceCreateWithoutUserInput, EventNotificationPreferenceUncheckedCreateWithoutUserInput> | EventNotificationPreferenceCreateWithoutUserInput[] | EventNotificationPreferenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventNotificationPreferenceCreateOrConnectWithoutUserInput | EventNotificationPreferenceCreateOrConnectWithoutUserInput[]
    createMany?: EventNotificationPreferenceCreateManyUserInputEnvelope
    connect?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
  }

  export type CalendarShareUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CalendarShareCreateWithoutOwnerInput, CalendarShareUncheckedCreateWithoutOwnerInput> | CalendarShareCreateWithoutOwnerInput[] | CalendarShareUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutOwnerInput | CalendarShareCreateOrConnectWithoutOwnerInput[]
    createMany?: CalendarShareCreateManyOwnerInputEnvelope
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
  }

  export type CalendarShareUncheckedCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<CalendarShareCreateWithoutSharedWithInput, CalendarShareUncheckedCreateWithoutSharedWithInput> | CalendarShareCreateWithoutSharedWithInput[] | CalendarShareUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutSharedWithInput | CalendarShareCreateOrConnectWithoutSharedWithInput[]
    createMany?: CalendarShareCreateManySharedWithInputEnvelope
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EventUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutUserInput | EventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutUserInput | EventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventUpdateManyWithWhereWithoutUserInput | EventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type NotificationDeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationDeviceCreateWithoutUserInput, NotificationDeviceUncheckedCreateWithoutUserInput> | NotificationDeviceCreateWithoutUserInput[] | NotificationDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationDeviceCreateOrConnectWithoutUserInput | NotificationDeviceCreateOrConnectWithoutUserInput[]
    upsert?: NotificationDeviceUpsertWithWhereUniqueWithoutUserInput | NotificationDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationDeviceCreateManyUserInputEnvelope
    set?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    disconnect?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    delete?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    connect?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    update?: NotificationDeviceUpdateWithWhereUniqueWithoutUserInput | NotificationDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationDeviceUpdateManyWithWhereWithoutUserInput | NotificationDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationDeviceScalarWhereInput | NotificationDeviceScalarWhereInput[]
  }

  export type EventNotificationPreferenceUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventNotificationPreferenceCreateWithoutUserInput, EventNotificationPreferenceUncheckedCreateWithoutUserInput> | EventNotificationPreferenceCreateWithoutUserInput[] | EventNotificationPreferenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventNotificationPreferenceCreateOrConnectWithoutUserInput | EventNotificationPreferenceCreateOrConnectWithoutUserInput[]
    upsert?: EventNotificationPreferenceUpsertWithWhereUniqueWithoutUserInput | EventNotificationPreferenceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventNotificationPreferenceCreateManyUserInputEnvelope
    set?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    disconnect?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    delete?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    connect?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    update?: EventNotificationPreferenceUpdateWithWhereUniqueWithoutUserInput | EventNotificationPreferenceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventNotificationPreferenceUpdateManyWithWhereWithoutUserInput | EventNotificationPreferenceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventNotificationPreferenceScalarWhereInput | EventNotificationPreferenceScalarWhereInput[]
  }

  export type CalendarShareUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CalendarShareCreateWithoutOwnerInput, CalendarShareUncheckedCreateWithoutOwnerInput> | CalendarShareCreateWithoutOwnerInput[] | CalendarShareUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutOwnerInput | CalendarShareCreateOrConnectWithoutOwnerInput[]
    upsert?: CalendarShareUpsertWithWhereUniqueWithoutOwnerInput | CalendarShareUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CalendarShareCreateManyOwnerInputEnvelope
    set?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    disconnect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    delete?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    update?: CalendarShareUpdateWithWhereUniqueWithoutOwnerInput | CalendarShareUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CalendarShareUpdateManyWithWhereWithoutOwnerInput | CalendarShareUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CalendarShareScalarWhereInput | CalendarShareScalarWhereInput[]
  }

  export type CalendarShareUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<CalendarShareCreateWithoutSharedWithInput, CalendarShareUncheckedCreateWithoutSharedWithInput> | CalendarShareCreateWithoutSharedWithInput[] | CalendarShareUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutSharedWithInput | CalendarShareCreateOrConnectWithoutSharedWithInput[]
    upsert?: CalendarShareUpsertWithWhereUniqueWithoutSharedWithInput | CalendarShareUpsertWithWhereUniqueWithoutSharedWithInput[]
    createMany?: CalendarShareCreateManySharedWithInputEnvelope
    set?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    disconnect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    delete?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    update?: CalendarShareUpdateWithWhereUniqueWithoutSharedWithInput | CalendarShareUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: CalendarShareUpdateManyWithWhereWithoutSharedWithInput | CalendarShareUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: CalendarShareScalarWhereInput | CalendarShareScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutUserInput | EventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutUserInput | EventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventUpdateManyWithWhereWithoutUserInput | EventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type NotificationDeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationDeviceCreateWithoutUserInput, NotificationDeviceUncheckedCreateWithoutUserInput> | NotificationDeviceCreateWithoutUserInput[] | NotificationDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationDeviceCreateOrConnectWithoutUserInput | NotificationDeviceCreateOrConnectWithoutUserInput[]
    upsert?: NotificationDeviceUpsertWithWhereUniqueWithoutUserInput | NotificationDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationDeviceCreateManyUserInputEnvelope
    set?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    disconnect?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    delete?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    connect?: NotificationDeviceWhereUniqueInput | NotificationDeviceWhereUniqueInput[]
    update?: NotificationDeviceUpdateWithWhereUniqueWithoutUserInput | NotificationDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationDeviceUpdateManyWithWhereWithoutUserInput | NotificationDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationDeviceScalarWhereInput | NotificationDeviceScalarWhereInput[]
  }

  export type EventNotificationPreferenceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventNotificationPreferenceCreateWithoutUserInput, EventNotificationPreferenceUncheckedCreateWithoutUserInput> | EventNotificationPreferenceCreateWithoutUserInput[] | EventNotificationPreferenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventNotificationPreferenceCreateOrConnectWithoutUserInput | EventNotificationPreferenceCreateOrConnectWithoutUserInput[]
    upsert?: EventNotificationPreferenceUpsertWithWhereUniqueWithoutUserInput | EventNotificationPreferenceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventNotificationPreferenceCreateManyUserInputEnvelope
    set?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    disconnect?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    delete?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    connect?: EventNotificationPreferenceWhereUniqueInput | EventNotificationPreferenceWhereUniqueInput[]
    update?: EventNotificationPreferenceUpdateWithWhereUniqueWithoutUserInput | EventNotificationPreferenceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventNotificationPreferenceUpdateManyWithWhereWithoutUserInput | EventNotificationPreferenceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventNotificationPreferenceScalarWhereInput | EventNotificationPreferenceScalarWhereInput[]
  }

  export type CalendarShareUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CalendarShareCreateWithoutOwnerInput, CalendarShareUncheckedCreateWithoutOwnerInput> | CalendarShareCreateWithoutOwnerInput[] | CalendarShareUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutOwnerInput | CalendarShareCreateOrConnectWithoutOwnerInput[]
    upsert?: CalendarShareUpsertWithWhereUniqueWithoutOwnerInput | CalendarShareUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CalendarShareCreateManyOwnerInputEnvelope
    set?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    disconnect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    delete?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    update?: CalendarShareUpdateWithWhereUniqueWithoutOwnerInput | CalendarShareUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CalendarShareUpdateManyWithWhereWithoutOwnerInput | CalendarShareUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CalendarShareScalarWhereInput | CalendarShareScalarWhereInput[]
  }

  export type CalendarShareUncheckedUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<CalendarShareCreateWithoutSharedWithInput, CalendarShareUncheckedCreateWithoutSharedWithInput> | CalendarShareCreateWithoutSharedWithInput[] | CalendarShareUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: CalendarShareCreateOrConnectWithoutSharedWithInput | CalendarShareCreateOrConnectWithoutSharedWithInput[]
    upsert?: CalendarShareUpsertWithWhereUniqueWithoutSharedWithInput | CalendarShareUpsertWithWhereUniqueWithoutSharedWithInput[]
    createMany?: CalendarShareCreateManySharedWithInputEnvelope
    set?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    disconnect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    delete?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    connect?: CalendarShareWhereUniqueInput | CalendarShareWhereUniqueInput[]
    update?: CalendarShareUpdateWithWhereUniqueWithoutSharedWithInput | CalendarShareUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: CalendarShareUpdateManyWithWhereWithoutSharedWithInput | CalendarShareUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: CalendarShareScalarWhereInput | CalendarShareScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutEventsInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    connect?: UserWhereUniqueInput
  }

  export type SubEventCreateNestedManyWithoutParentEventInput = {
    create?: XOR<SubEventCreateWithoutParentEventInput, SubEventUncheckedCreateWithoutParentEventInput> | SubEventCreateWithoutParentEventInput[] | SubEventUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: SubEventCreateOrConnectWithoutParentEventInput | SubEventCreateOrConnectWithoutParentEventInput[]
    createMany?: SubEventCreateManyParentEventInputEnvelope
    connect?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
  }

  export type RinvioCreateNestedManyWithoutParentEventInput = {
    create?: XOR<RinvioCreateWithoutParentEventInput, RinvioUncheckedCreateWithoutParentEventInput> | RinvioCreateWithoutParentEventInput[] | RinvioUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: RinvioCreateOrConnectWithoutParentEventInput | RinvioCreateOrConnectWithoutParentEventInput[]
    createMany?: RinvioCreateManyParentEventInputEnvelope
    connect?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
  }

  export type SubEventUncheckedCreateNestedManyWithoutParentEventInput = {
    create?: XOR<SubEventCreateWithoutParentEventInput, SubEventUncheckedCreateWithoutParentEventInput> | SubEventCreateWithoutParentEventInput[] | SubEventUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: SubEventCreateOrConnectWithoutParentEventInput | SubEventCreateOrConnectWithoutParentEventInput[]
    createMany?: SubEventCreateManyParentEventInputEnvelope
    connect?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
  }

  export type RinvioUncheckedCreateNestedManyWithoutParentEventInput = {
    create?: XOR<RinvioCreateWithoutParentEventInput, RinvioUncheckedCreateWithoutParentEventInput> | RinvioCreateWithoutParentEventInput[] | RinvioUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: RinvioCreateOrConnectWithoutParentEventInput | RinvioCreateOrConnectWithoutParentEventInput[]
    createMany?: RinvioCreateManyParentEventInputEnvelope
    connect?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    upsert?: UserUpsertWithoutEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEventsInput, UserUpdateWithoutEventsInput>, UserUncheckedUpdateWithoutEventsInput>
  }

  export type SubEventUpdateManyWithoutParentEventNestedInput = {
    create?: XOR<SubEventCreateWithoutParentEventInput, SubEventUncheckedCreateWithoutParentEventInput> | SubEventCreateWithoutParentEventInput[] | SubEventUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: SubEventCreateOrConnectWithoutParentEventInput | SubEventCreateOrConnectWithoutParentEventInput[]
    upsert?: SubEventUpsertWithWhereUniqueWithoutParentEventInput | SubEventUpsertWithWhereUniqueWithoutParentEventInput[]
    createMany?: SubEventCreateManyParentEventInputEnvelope
    set?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    disconnect?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    delete?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    connect?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    update?: SubEventUpdateWithWhereUniqueWithoutParentEventInput | SubEventUpdateWithWhereUniqueWithoutParentEventInput[]
    updateMany?: SubEventUpdateManyWithWhereWithoutParentEventInput | SubEventUpdateManyWithWhereWithoutParentEventInput[]
    deleteMany?: SubEventScalarWhereInput | SubEventScalarWhereInput[]
  }

  export type RinvioUpdateManyWithoutParentEventNestedInput = {
    create?: XOR<RinvioCreateWithoutParentEventInput, RinvioUncheckedCreateWithoutParentEventInput> | RinvioCreateWithoutParentEventInput[] | RinvioUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: RinvioCreateOrConnectWithoutParentEventInput | RinvioCreateOrConnectWithoutParentEventInput[]
    upsert?: RinvioUpsertWithWhereUniqueWithoutParentEventInput | RinvioUpsertWithWhereUniqueWithoutParentEventInput[]
    createMany?: RinvioCreateManyParentEventInputEnvelope
    set?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    disconnect?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    delete?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    connect?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    update?: RinvioUpdateWithWhereUniqueWithoutParentEventInput | RinvioUpdateWithWhereUniqueWithoutParentEventInput[]
    updateMany?: RinvioUpdateManyWithWhereWithoutParentEventInput | RinvioUpdateManyWithWhereWithoutParentEventInput[]
    deleteMany?: RinvioScalarWhereInput | RinvioScalarWhereInput[]
  }

  export type SubEventUncheckedUpdateManyWithoutParentEventNestedInput = {
    create?: XOR<SubEventCreateWithoutParentEventInput, SubEventUncheckedCreateWithoutParentEventInput> | SubEventCreateWithoutParentEventInput[] | SubEventUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: SubEventCreateOrConnectWithoutParentEventInput | SubEventCreateOrConnectWithoutParentEventInput[]
    upsert?: SubEventUpsertWithWhereUniqueWithoutParentEventInput | SubEventUpsertWithWhereUniqueWithoutParentEventInput[]
    createMany?: SubEventCreateManyParentEventInputEnvelope
    set?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    disconnect?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    delete?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    connect?: SubEventWhereUniqueInput | SubEventWhereUniqueInput[]
    update?: SubEventUpdateWithWhereUniqueWithoutParentEventInput | SubEventUpdateWithWhereUniqueWithoutParentEventInput[]
    updateMany?: SubEventUpdateManyWithWhereWithoutParentEventInput | SubEventUpdateManyWithWhereWithoutParentEventInput[]
    deleteMany?: SubEventScalarWhereInput | SubEventScalarWhereInput[]
  }

  export type RinvioUncheckedUpdateManyWithoutParentEventNestedInput = {
    create?: XOR<RinvioCreateWithoutParentEventInput, RinvioUncheckedCreateWithoutParentEventInput> | RinvioCreateWithoutParentEventInput[] | RinvioUncheckedCreateWithoutParentEventInput[]
    connectOrCreate?: RinvioCreateOrConnectWithoutParentEventInput | RinvioCreateOrConnectWithoutParentEventInput[]
    upsert?: RinvioUpsertWithWhereUniqueWithoutParentEventInput | RinvioUpsertWithWhereUniqueWithoutParentEventInput[]
    createMany?: RinvioCreateManyParentEventInputEnvelope
    set?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    disconnect?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    delete?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    connect?: RinvioWhereUniqueInput | RinvioWhereUniqueInput[]
    update?: RinvioUpdateWithWhereUniqueWithoutParentEventInput | RinvioUpdateWithWhereUniqueWithoutParentEventInput[]
    updateMany?: RinvioUpdateManyWithWhereWithoutParentEventInput | RinvioUpdateManyWithWhereWithoutParentEventInput[]
    deleteMany?: RinvioScalarWhereInput | RinvioScalarWhereInput[]
  }

  export type EventCreateNestedOneWithoutSubEventsInput = {
    create?: XOR<EventCreateWithoutSubEventsInput, EventUncheckedCreateWithoutSubEventsInput>
    connectOrCreate?: EventCreateOrConnectWithoutSubEventsInput
    connect?: EventWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EventUpdateOneRequiredWithoutSubEventsNestedInput = {
    create?: XOR<EventCreateWithoutSubEventsInput, EventUncheckedCreateWithoutSubEventsInput>
    connectOrCreate?: EventCreateOrConnectWithoutSubEventsInput
    upsert?: EventUpsertWithoutSubEventsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutSubEventsInput, EventUpdateWithoutSubEventsInput>, EventUncheckedUpdateWithoutSubEventsInput>
  }

  export type EventCreateNestedOneWithoutRinviiInput = {
    create?: XOR<EventCreateWithoutRinviiInput, EventUncheckedCreateWithoutRinviiInput>
    connectOrCreate?: EventCreateOrConnectWithoutRinviiInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutRinviiNestedInput = {
    create?: XOR<EventCreateWithoutRinviiInput, EventUncheckedCreateWithoutRinviiInput>
    connectOrCreate?: EventCreateOrConnectWithoutRinviiInput
    upsert?: EventUpsertWithoutRinviiInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutRinviiInput, EventUpdateWithoutRinviiInput>, EventUncheckedUpdateWithoutRinviiInput>
  }

  export type UserCreateNestedOneWithoutNotificationDevicesInput = {
    create?: XOR<UserCreateWithoutNotificationDevicesInput, UserUncheckedCreateWithoutNotificationDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationDevicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationDevicesNestedInput = {
    create?: XOR<UserCreateWithoutNotificationDevicesInput, UserUncheckedCreateWithoutNotificationDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationDevicesInput
    upsert?: UserUpsertWithoutNotificationDevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationDevicesInput, UserUpdateWithoutNotificationDevicesInput>, UserUncheckedUpdateWithoutNotificationDevicesInput>
  }

  export type UserCreateNestedOneWithoutEventNotificationPrefsInput = {
    create?: XOR<UserCreateWithoutEventNotificationPrefsInput, UserUncheckedCreateWithoutEventNotificationPrefsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventNotificationPrefsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutEventNotificationPrefsNestedInput = {
    create?: XOR<UserCreateWithoutEventNotificationPrefsInput, UserUncheckedCreateWithoutEventNotificationPrefsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventNotificationPrefsInput
    upsert?: UserUpsertWithoutEventNotificationPrefsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEventNotificationPrefsInput, UserUpdateWithoutEventNotificationPrefsInput>, UserUncheckedUpdateWithoutEventNotificationPrefsInput>
  }

  export type UserCreateNestedOneWithoutSharedByMeInput = {
    create?: XOR<UserCreateWithoutSharedByMeInput, UserUncheckedCreateWithoutSharedByMeInput>
    connectOrCreate?: UserCreateOrConnectWithoutSharedByMeInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSharedWithMeInput = {
    create?: XOR<UserCreateWithoutSharedWithMeInput, UserUncheckedCreateWithoutSharedWithMeInput>
    connectOrCreate?: UserCreateOrConnectWithoutSharedWithMeInput
    connect?: UserWhereUniqueInput
  }

  export type EnumSharePermissionFieldUpdateOperationsInput = {
    set?: $Enums.SharePermission
  }

  export type UserUpdateOneRequiredWithoutSharedByMeNestedInput = {
    create?: XOR<UserCreateWithoutSharedByMeInput, UserUncheckedCreateWithoutSharedByMeInput>
    connectOrCreate?: UserCreateOrConnectWithoutSharedByMeInput
    upsert?: UserUpsertWithoutSharedByMeInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSharedByMeInput, UserUpdateWithoutSharedByMeInput>, UserUncheckedUpdateWithoutSharedByMeInput>
  }

  export type UserUpdateOneRequiredWithoutSharedWithMeNestedInput = {
    create?: XOR<UserCreateWithoutSharedWithMeInput, UserUncheckedCreateWithoutSharedWithMeInput>
    connectOrCreate?: UserCreateOrConnectWithoutSharedWithMeInput
    upsert?: UserUpsertWithoutSharedWithMeInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSharedWithMeInput, UserUpdateWithoutSharedWithMeInput>, UserUncheckedUpdateWithoutSharedWithMeInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type NestedEnumSharePermissionFilter<$PrismaModel = never> = {
    equals?: $Enums.SharePermission | EnumSharePermissionFieldRefInput<$PrismaModel>
    in?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    notIn?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    not?: NestedEnumSharePermissionFilter<$PrismaModel> | $Enums.SharePermission
  }

  export type NestedEnumSharePermissionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SharePermission | EnumSharePermissionFieldRefInput<$PrismaModel>
    in?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    notIn?: $Enums.SharePermission[] | ListEnumSharePermissionFieldRefInput<$PrismaModel>
    not?: NestedEnumSharePermissionWithAggregatesFilter<$PrismaModel> | $Enums.SharePermission
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSharePermissionFilter<$PrismaModel>
    _max?: NestedEnumSharePermissionFilter<$PrismaModel>
  }

  export type EventCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    orgId?: string | null
    subEvents?: SubEventCreateNestedManyWithoutParentEventInput
    rinvii?: RinvioCreateNestedManyWithoutParentEventInput
  }

  export type EventUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    orgId?: string | null
    subEvents?: SubEventUncheckedCreateNestedManyWithoutParentEventInput
    rinvii?: RinvioUncheckedCreateNestedManyWithoutParentEventInput
  }

  export type EventCreateOrConnectWithoutUserInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput>
  }

  export type EventCreateManyUserInputEnvelope = {
    data: EventCreateManyUserInput | EventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationDeviceCreateWithoutUserInput = {
    id?: string
    provider?: string
    externalDeviceId: string
    pushToken?: string | null
    platform?: string | null
    locale?: string | null
    notificationsOn?: boolean
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeviceUncheckedCreateWithoutUserInput = {
    id?: string
    provider?: string
    externalDeviceId: string
    pushToken?: string | null
    platform?: string | null
    locale?: string | null
    notificationsOn?: boolean
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeviceCreateOrConnectWithoutUserInput = {
    where: NotificationDeviceWhereUniqueInput
    create: XOR<NotificationDeviceCreateWithoutUserInput, NotificationDeviceUncheckedCreateWithoutUserInput>
  }

  export type NotificationDeviceCreateManyUserInputEnvelope = {
    data: NotificationDeviceCreateManyUserInput | NotificationDeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EventNotificationPreferenceCreateWithoutUserInput = {
    id?: string
    eventType?: string | null
    macroArea?: string | null
    enabled?: boolean
    notifyHoursBefore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventNotificationPreferenceUncheckedCreateWithoutUserInput = {
    id?: string
    eventType?: string | null
    macroArea?: string | null
    enabled?: boolean
    notifyHoursBefore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventNotificationPreferenceCreateOrConnectWithoutUserInput = {
    where: EventNotificationPreferenceWhereUniqueInput
    create: XOR<EventNotificationPreferenceCreateWithoutUserInput, EventNotificationPreferenceUncheckedCreateWithoutUserInput>
  }

  export type EventNotificationPreferenceCreateManyUserInputEnvelope = {
    data: EventNotificationPreferenceCreateManyUserInput | EventNotificationPreferenceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CalendarShareCreateWithoutOwnerInput = {
    id?: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
    sharedWith: UserCreateNestedOneWithoutSharedWithMeInput
  }

  export type CalendarShareUncheckedCreateWithoutOwnerInput = {
    id?: string
    sharedWithId: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarShareCreateOrConnectWithoutOwnerInput = {
    where: CalendarShareWhereUniqueInput
    create: XOR<CalendarShareCreateWithoutOwnerInput, CalendarShareUncheckedCreateWithoutOwnerInput>
  }

  export type CalendarShareCreateManyOwnerInputEnvelope = {
    data: CalendarShareCreateManyOwnerInput | CalendarShareCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type CalendarShareCreateWithoutSharedWithInput = {
    id?: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutSharedByMeInput
  }

  export type CalendarShareUncheckedCreateWithoutSharedWithInput = {
    id?: string
    ownerId: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarShareCreateOrConnectWithoutSharedWithInput = {
    where: CalendarShareWhereUniqueInput
    create: XOR<CalendarShareCreateWithoutSharedWithInput, CalendarShareUncheckedCreateWithoutSharedWithInput>
  }

  export type CalendarShareCreateManySharedWithInputEnvelope = {
    data: CalendarShareCreateManySharedWithInput | CalendarShareCreateManySharedWithInput[]
    skipDuplicates?: boolean
  }

  export type EventUpsertWithWhereUniqueWithoutUserInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutUserInput, EventUncheckedUpdateWithoutUserInput>
    create: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput>
  }

  export type EventUpdateWithWhereUniqueWithoutUserInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutUserInput, EventUncheckedUpdateWithoutUserInput>
  }

  export type EventUpdateManyWithWhereWithoutUserInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutUserInput>
  }

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[]
    OR?: EventScalarWhereInput[]
    NOT?: EventScalarWhereInput | EventScalarWhereInput[]
    id?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    description?: StringNullableFilter<"Event"> | string | null
    startAt?: DateTimeFilter<"Event"> | Date | string
    endAt?: DateTimeFilter<"Event"> | Date | string
    type?: StringFilter<"Event"> | string
    tags?: StringFilter<"Event"> | string
    caseId?: StringNullableFilter<"Event"> | string | null
    notes?: StringNullableFilter<"Event"> | string | null
    generateSubEvents?: BoolFilter<"Event"> | boolean
    ruleTemplateId?: StringNullableFilter<"Event"> | string | null
    ruleParams?: StringNullableFilter<"Event"> | string | null
    macroType?: StringNullableFilter<"Event"> | string | null
    macroArea?: StringNullableFilter<"Event"> | string | null
    procedimento?: StringNullableFilter<"Event"> | string | null
    parteProcessuale?: StringNullableFilter<"Event"> | string | null
    eventoCode?: StringNullableFilter<"Event"> | string | null
    inputs?: StringNullableFilter<"Event"> | string | null
    color?: StringNullableFilter<"Event"> | string | null
    status?: StringFilter<"Event"> | string
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    userId?: StringFilter<"Event"> | string
    orgId?: StringNullableFilter<"Event"> | string | null
  }

  export type NotificationDeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationDeviceWhereUniqueInput
    update: XOR<NotificationDeviceUpdateWithoutUserInput, NotificationDeviceUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationDeviceCreateWithoutUserInput, NotificationDeviceUncheckedCreateWithoutUserInput>
  }

  export type NotificationDeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationDeviceWhereUniqueInput
    data: XOR<NotificationDeviceUpdateWithoutUserInput, NotificationDeviceUncheckedUpdateWithoutUserInput>
  }

  export type NotificationDeviceUpdateManyWithWhereWithoutUserInput = {
    where: NotificationDeviceScalarWhereInput
    data: XOR<NotificationDeviceUpdateManyMutationInput, NotificationDeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationDeviceScalarWhereInput = {
    AND?: NotificationDeviceScalarWhereInput | NotificationDeviceScalarWhereInput[]
    OR?: NotificationDeviceScalarWhereInput[]
    NOT?: NotificationDeviceScalarWhereInput | NotificationDeviceScalarWhereInput[]
    id?: StringFilter<"NotificationDevice"> | string
    userId?: StringFilter<"NotificationDevice"> | string
    provider?: StringFilter<"NotificationDevice"> | string
    externalDeviceId?: StringFilter<"NotificationDevice"> | string
    pushToken?: StringNullableFilter<"NotificationDevice"> | string | null
    platform?: StringNullableFilter<"NotificationDevice"> | string | null
    locale?: StringNullableFilter<"NotificationDevice"> | string | null
    notificationsOn?: BoolFilter<"NotificationDevice"> | boolean
    lastSeenAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    createdAt?: DateTimeFilter<"NotificationDevice"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationDevice"> | Date | string
  }

  export type EventNotificationPreferenceUpsertWithWhereUniqueWithoutUserInput = {
    where: EventNotificationPreferenceWhereUniqueInput
    update: XOR<EventNotificationPreferenceUpdateWithoutUserInput, EventNotificationPreferenceUncheckedUpdateWithoutUserInput>
    create: XOR<EventNotificationPreferenceCreateWithoutUserInput, EventNotificationPreferenceUncheckedCreateWithoutUserInput>
  }

  export type EventNotificationPreferenceUpdateWithWhereUniqueWithoutUserInput = {
    where: EventNotificationPreferenceWhereUniqueInput
    data: XOR<EventNotificationPreferenceUpdateWithoutUserInput, EventNotificationPreferenceUncheckedUpdateWithoutUserInput>
  }

  export type EventNotificationPreferenceUpdateManyWithWhereWithoutUserInput = {
    where: EventNotificationPreferenceScalarWhereInput
    data: XOR<EventNotificationPreferenceUpdateManyMutationInput, EventNotificationPreferenceUncheckedUpdateManyWithoutUserInput>
  }

  export type EventNotificationPreferenceScalarWhereInput = {
    AND?: EventNotificationPreferenceScalarWhereInput | EventNotificationPreferenceScalarWhereInput[]
    OR?: EventNotificationPreferenceScalarWhereInput[]
    NOT?: EventNotificationPreferenceScalarWhereInput | EventNotificationPreferenceScalarWhereInput[]
    id?: StringFilter<"EventNotificationPreference"> | string
    userId?: StringFilter<"EventNotificationPreference"> | string
    eventType?: StringNullableFilter<"EventNotificationPreference"> | string | null
    macroArea?: StringNullableFilter<"EventNotificationPreference"> | string | null
    enabled?: BoolFilter<"EventNotificationPreference"> | boolean
    notifyHoursBefore?: IntNullableFilter<"EventNotificationPreference"> | number | null
    createdAt?: DateTimeFilter<"EventNotificationPreference"> | Date | string
    updatedAt?: DateTimeFilter<"EventNotificationPreference"> | Date | string
  }

  export type CalendarShareUpsertWithWhereUniqueWithoutOwnerInput = {
    where: CalendarShareWhereUniqueInput
    update: XOR<CalendarShareUpdateWithoutOwnerInput, CalendarShareUncheckedUpdateWithoutOwnerInput>
    create: XOR<CalendarShareCreateWithoutOwnerInput, CalendarShareUncheckedCreateWithoutOwnerInput>
  }

  export type CalendarShareUpdateWithWhereUniqueWithoutOwnerInput = {
    where: CalendarShareWhereUniqueInput
    data: XOR<CalendarShareUpdateWithoutOwnerInput, CalendarShareUncheckedUpdateWithoutOwnerInput>
  }

  export type CalendarShareUpdateManyWithWhereWithoutOwnerInput = {
    where: CalendarShareScalarWhereInput
    data: XOR<CalendarShareUpdateManyMutationInput, CalendarShareUncheckedUpdateManyWithoutOwnerInput>
  }

  export type CalendarShareScalarWhereInput = {
    AND?: CalendarShareScalarWhereInput | CalendarShareScalarWhereInput[]
    OR?: CalendarShareScalarWhereInput[]
    NOT?: CalendarShareScalarWhereInput | CalendarShareScalarWhereInput[]
    id?: StringFilter<"CalendarShare"> | string
    ownerId?: StringFilter<"CalendarShare"> | string
    sharedWithId?: StringFilter<"CalendarShare"> | string
    permission?: EnumSharePermissionFilter<"CalendarShare"> | $Enums.SharePermission
    createdAt?: DateTimeFilter<"CalendarShare"> | Date | string
    updatedAt?: DateTimeFilter<"CalendarShare"> | Date | string
  }

  export type CalendarShareUpsertWithWhereUniqueWithoutSharedWithInput = {
    where: CalendarShareWhereUniqueInput
    update: XOR<CalendarShareUpdateWithoutSharedWithInput, CalendarShareUncheckedUpdateWithoutSharedWithInput>
    create: XOR<CalendarShareCreateWithoutSharedWithInput, CalendarShareUncheckedCreateWithoutSharedWithInput>
  }

  export type CalendarShareUpdateWithWhereUniqueWithoutSharedWithInput = {
    where: CalendarShareWhereUniqueInput
    data: XOR<CalendarShareUpdateWithoutSharedWithInput, CalendarShareUncheckedUpdateWithoutSharedWithInput>
  }

  export type CalendarShareUpdateManyWithWhereWithoutSharedWithInput = {
    where: CalendarShareScalarWhereInput
    data: XOR<CalendarShareUpdateManyMutationInput, CalendarShareUncheckedUpdateManyWithoutSharedWithInput>
  }

  export type UserCreateWithoutEventsInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notificationDevices?: NotificationDeviceCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateWithoutEventsInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notificationDevices?: NotificationDeviceUncheckedCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareUncheckedCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserCreateOrConnectWithoutEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
  }

  export type SubEventCreateWithoutParentEventInput = {
    id?: string
    title: string
    kind: string
    dueAt?: Date | string | null
    status?: string
    priority?: number
    ruleId?: string | null
    ruleParams?: string | null
    explanation?: string | null
    createdBy?: string
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubEventUncheckedCreateWithoutParentEventInput = {
    id?: string
    title: string
    kind: string
    dueAt?: Date | string | null
    status?: string
    priority?: number
    ruleId?: string | null
    ruleParams?: string | null
    explanation?: string | null
    createdBy?: string
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubEventCreateOrConnectWithoutParentEventInput = {
    where: SubEventWhereUniqueInput
    create: XOR<SubEventCreateWithoutParentEventInput, SubEventUncheckedCreateWithoutParentEventInput>
  }

  export type SubEventCreateManyParentEventInputEnvelope = {
    data: SubEventCreateManyParentEventInput | SubEventCreateManyParentEventInput[]
    skipDuplicates?: boolean
  }

  export type RinvioCreateWithoutParentEventInput = {
    id?: string
    numero: number
    dataUdienza: Date | string
    tipoUdienza: string
    tipoUdienzaCustom?: string | null
    note?: string | null
    adempimenti?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RinvioUncheckedCreateWithoutParentEventInput = {
    id?: string
    numero: number
    dataUdienza: Date | string
    tipoUdienza: string
    tipoUdienzaCustom?: string | null
    note?: string | null
    adempimenti?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RinvioCreateOrConnectWithoutParentEventInput = {
    where: RinvioWhereUniqueInput
    create: XOR<RinvioCreateWithoutParentEventInput, RinvioUncheckedCreateWithoutParentEventInput>
  }

  export type RinvioCreateManyParentEventInputEnvelope = {
    data: RinvioCreateManyParentEventInput | RinvioCreateManyParentEventInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutEventsInput = {
    update: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
  }

  export type UserUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notificationDevices?: NotificationDeviceUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notificationDevices?: NotificationDeviceUncheckedUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUncheckedUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type SubEventUpsertWithWhereUniqueWithoutParentEventInput = {
    where: SubEventWhereUniqueInput
    update: XOR<SubEventUpdateWithoutParentEventInput, SubEventUncheckedUpdateWithoutParentEventInput>
    create: XOR<SubEventCreateWithoutParentEventInput, SubEventUncheckedCreateWithoutParentEventInput>
  }

  export type SubEventUpdateWithWhereUniqueWithoutParentEventInput = {
    where: SubEventWhereUniqueInput
    data: XOR<SubEventUpdateWithoutParentEventInput, SubEventUncheckedUpdateWithoutParentEventInput>
  }

  export type SubEventUpdateManyWithWhereWithoutParentEventInput = {
    where: SubEventScalarWhereInput
    data: XOR<SubEventUpdateManyMutationInput, SubEventUncheckedUpdateManyWithoutParentEventInput>
  }

  export type SubEventScalarWhereInput = {
    AND?: SubEventScalarWhereInput | SubEventScalarWhereInput[]
    OR?: SubEventScalarWhereInput[]
    NOT?: SubEventScalarWhereInput | SubEventScalarWhereInput[]
    id?: StringFilter<"SubEvent"> | string
    parentEventId?: StringFilter<"SubEvent"> | string
    title?: StringFilter<"SubEvent"> | string
    kind?: StringFilter<"SubEvent"> | string
    dueAt?: DateTimeNullableFilter<"SubEvent"> | Date | string | null
    status?: StringFilter<"SubEvent"> | string
    priority?: IntFilter<"SubEvent"> | number
    ruleId?: StringNullableFilter<"SubEvent"> | string | null
    ruleParams?: StringNullableFilter<"SubEvent"> | string | null
    explanation?: StringNullableFilter<"SubEvent"> | string | null
    createdBy?: StringFilter<"SubEvent"> | string
    locked?: BoolFilter<"SubEvent"> | boolean
    isPlaceholder?: BoolFilter<"SubEvent"> | boolean
    createdAt?: DateTimeFilter<"SubEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SubEvent"> | Date | string
  }

  export type RinvioUpsertWithWhereUniqueWithoutParentEventInput = {
    where: RinvioWhereUniqueInput
    update: XOR<RinvioUpdateWithoutParentEventInput, RinvioUncheckedUpdateWithoutParentEventInput>
    create: XOR<RinvioCreateWithoutParentEventInput, RinvioUncheckedCreateWithoutParentEventInput>
  }

  export type RinvioUpdateWithWhereUniqueWithoutParentEventInput = {
    where: RinvioWhereUniqueInput
    data: XOR<RinvioUpdateWithoutParentEventInput, RinvioUncheckedUpdateWithoutParentEventInput>
  }

  export type RinvioUpdateManyWithWhereWithoutParentEventInput = {
    where: RinvioScalarWhereInput
    data: XOR<RinvioUpdateManyMutationInput, RinvioUncheckedUpdateManyWithoutParentEventInput>
  }

  export type RinvioScalarWhereInput = {
    AND?: RinvioScalarWhereInput | RinvioScalarWhereInput[]
    OR?: RinvioScalarWhereInput[]
    NOT?: RinvioScalarWhereInput | RinvioScalarWhereInput[]
    id?: StringFilter<"Rinvio"> | string
    parentEventId?: StringFilter<"Rinvio"> | string
    numero?: IntFilter<"Rinvio"> | number
    dataUdienza?: DateTimeFilter<"Rinvio"> | Date | string
    tipoUdienza?: StringFilter<"Rinvio"> | string
    tipoUdienzaCustom?: StringNullableFilter<"Rinvio"> | string | null
    note?: StringNullableFilter<"Rinvio"> | string | null
    adempimenti?: StringFilter<"Rinvio"> | string
    createdAt?: DateTimeFilter<"Rinvio"> | Date | string
    updatedAt?: DateTimeFilter<"Rinvio"> | Date | string
  }

  export type EventCreateWithoutSubEventsInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    orgId?: string | null
    user: UserCreateNestedOneWithoutEventsInput
    rinvii?: RinvioCreateNestedManyWithoutParentEventInput
  }

  export type EventUncheckedCreateWithoutSubEventsInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    orgId?: string | null
    rinvii?: RinvioUncheckedCreateNestedManyWithoutParentEventInput
  }

  export type EventCreateOrConnectWithoutSubEventsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutSubEventsInput, EventUncheckedCreateWithoutSubEventsInput>
  }

  export type EventUpsertWithoutSubEventsInput = {
    update: XOR<EventUpdateWithoutSubEventsInput, EventUncheckedUpdateWithoutSubEventsInput>
    create: XOR<EventCreateWithoutSubEventsInput, EventUncheckedCreateWithoutSubEventsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutSubEventsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutSubEventsInput, EventUncheckedUpdateWithoutSubEventsInput>
  }

  export type EventUpdateWithoutSubEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    rinvii?: RinvioUpdateManyWithoutParentEventNestedInput
  }

  export type EventUncheckedUpdateWithoutSubEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    rinvii?: RinvioUncheckedUpdateManyWithoutParentEventNestedInput
  }

  export type EventCreateWithoutRinviiInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    orgId?: string | null
    user: UserCreateNestedOneWithoutEventsInput
    subEvents?: SubEventCreateNestedManyWithoutParentEventInput
  }

  export type EventUncheckedCreateWithoutRinviiInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    orgId?: string | null
    subEvents?: SubEventUncheckedCreateNestedManyWithoutParentEventInput
  }

  export type EventCreateOrConnectWithoutRinviiInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutRinviiInput, EventUncheckedCreateWithoutRinviiInput>
  }

  export type EventUpsertWithoutRinviiInput = {
    update: XOR<EventUpdateWithoutRinviiInput, EventUncheckedUpdateWithoutRinviiInput>
    create: XOR<EventCreateWithoutRinviiInput, EventUncheckedCreateWithoutRinviiInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutRinviiInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutRinviiInput, EventUncheckedUpdateWithoutRinviiInput>
  }

  export type EventUpdateWithoutRinviiInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    subEvents?: SubEventUpdateManyWithoutParentEventNestedInput
  }

  export type EventUncheckedUpdateWithoutRinviiInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    subEvents?: SubEventUncheckedUpdateManyWithoutParentEventNestedInput
  }

  export type UserCreateWithoutNotificationDevicesInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateWithoutNotificationDevicesInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareUncheckedCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserCreateOrConnectWithoutNotificationDevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationDevicesInput, UserUncheckedCreateWithoutNotificationDevicesInput>
  }

  export type UserUpsertWithoutNotificationDevicesInput = {
    update: XOR<UserUpdateWithoutNotificationDevicesInput, UserUncheckedUpdateWithoutNotificationDevicesInput>
    create: XOR<UserCreateWithoutNotificationDevicesInput, UserUncheckedCreateWithoutNotificationDevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationDevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationDevicesInput, UserUncheckedUpdateWithoutNotificationDevicesInput>
  }

  export type UserUpdateWithoutNotificationDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUncheckedUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type UserCreateWithoutEventNotificationPrefsInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateWithoutEventNotificationPrefsInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceUncheckedCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareUncheckedCreateNestedManyWithoutOwnerInput
    sharedWithMe?: CalendarShareUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserCreateOrConnectWithoutEventNotificationPrefsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEventNotificationPrefsInput, UserUncheckedCreateWithoutEventNotificationPrefsInput>
  }

  export type UserUpsertWithoutEventNotificationPrefsInput = {
    update: XOR<UserUpdateWithoutEventNotificationPrefsInput, UserUncheckedUpdateWithoutEventNotificationPrefsInput>
    create: XOR<UserCreateWithoutEventNotificationPrefsInput, UserUncheckedCreateWithoutEventNotificationPrefsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEventNotificationPrefsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEventNotificationPrefsInput, UserUncheckedUpdateWithoutEventNotificationPrefsInput>
  }

  export type UserUpdateWithoutEventNotificationPrefsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateWithoutEventNotificationPrefsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUncheckedUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUncheckedUpdateManyWithoutOwnerNestedInput
    sharedWithMe?: CalendarShareUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type UserCreateWithoutSharedByMeInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceCreateNestedManyWithoutUserInput
    sharedWithMe?: CalendarShareCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateWithoutSharedByMeInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceUncheckedCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedCreateNestedManyWithoutUserInput
    sharedWithMe?: CalendarShareUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserCreateOrConnectWithoutSharedByMeInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSharedByMeInput, UserUncheckedCreateWithoutSharedByMeInput>
  }

  export type UserCreateWithoutSharedWithMeInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutSharedWithMeInput = {
    id?: string
    clerkUserId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    notificationDevices?: NotificationDeviceUncheckedCreateNestedManyWithoutUserInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedCreateNestedManyWithoutUserInput
    sharedByMe?: CalendarShareUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutSharedWithMeInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSharedWithMeInput, UserUncheckedCreateWithoutSharedWithMeInput>
  }

  export type UserUpsertWithoutSharedByMeInput = {
    update: XOR<UserUpdateWithoutSharedByMeInput, UserUncheckedUpdateWithoutSharedByMeInput>
    create: XOR<UserCreateWithoutSharedByMeInput, UserUncheckedCreateWithoutSharedByMeInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSharedByMeInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSharedByMeInput, UserUncheckedUpdateWithoutSharedByMeInput>
  }

  export type UserUpdateWithoutSharedByMeInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUpdateManyWithoutUserNestedInput
    sharedWithMe?: CalendarShareUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateWithoutSharedByMeInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUncheckedUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedUpdateManyWithoutUserNestedInput
    sharedWithMe?: CalendarShareUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUpsertWithoutSharedWithMeInput = {
    update: XOR<UserUpdateWithoutSharedWithMeInput, UserUncheckedUpdateWithoutSharedWithMeInput>
    create: XOR<UserCreateWithoutSharedWithMeInput, UserUncheckedCreateWithoutSharedWithMeInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSharedWithMeInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSharedWithMeInput, UserUncheckedUpdateWithoutSharedWithMeInput>
  }

  export type UserUpdateWithoutSharedWithMeInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutSharedWithMeInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkUserId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    notificationDevices?: NotificationDeviceUncheckedUpdateManyWithoutUserNestedInput
    eventNotificationPrefs?: EventNotificationPreferenceUncheckedUpdateManyWithoutUserNestedInput
    sharedByMe?: CalendarShareUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type EventCreateManyUserInput = {
    id?: string
    title: string
    description?: string | null
    startAt: Date | string
    endAt: Date | string
    type?: string
    tags?: string
    caseId?: string | null
    notes?: string | null
    generateSubEvents?: boolean
    ruleTemplateId?: string | null
    ruleParams?: string | null
    macroType?: string | null
    macroArea?: string | null
    procedimento?: string | null
    parteProcessuale?: string | null
    eventoCode?: string | null
    inputs?: string | null
    color?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    orgId?: string | null
  }

  export type NotificationDeviceCreateManyUserInput = {
    id?: string
    provider?: string
    externalDeviceId: string
    pushToken?: string | null
    platform?: string | null
    locale?: string | null
    notificationsOn?: boolean
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventNotificationPreferenceCreateManyUserInput = {
    id?: string
    eventType?: string | null
    macroArea?: string | null
    enabled?: boolean
    notifyHoursBefore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarShareCreateManyOwnerInput = {
    id?: string
    sharedWithId: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarShareCreateManySharedWithInput = {
    id?: string
    ownerId: string
    permission?: $Enums.SharePermission
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    subEvents?: SubEventUpdateManyWithoutParentEventNestedInput
    rinvii?: RinvioUpdateManyWithoutParentEventNestedInput
  }

  export type EventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
    subEvents?: SubEventUncheckedUpdateManyWithoutParentEventNestedInput
    rinvii?: RinvioUncheckedUpdateManyWithoutParentEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    tags?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    generateSubEvents?: BoolFieldUpdateOperationsInput | boolean
    ruleTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    macroType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    procedimento?: NullableStringFieldUpdateOperationsInput | string | null
    parteProcessuale?: NullableStringFieldUpdateOperationsInput | string | null
    eventoCode?: NullableStringFieldUpdateOperationsInput | string | null
    inputs?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orgId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationDeviceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    externalDeviceId?: StringFieldUpdateOperationsInput | string
    pushToken?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    notificationsOn?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeviceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    externalDeviceId?: StringFieldUpdateOperationsInput | string
    pushToken?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    notificationsOn?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeviceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    externalDeviceId?: StringFieldUpdateOperationsInput | string
    pushToken?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableStringFieldUpdateOperationsInput | string | null
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    notificationsOn?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventNotificationPreferenceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    notifyHoursBefore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventNotificationPreferenceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    notifyHoursBefore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventNotificationPreferenceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    macroArea?: NullableStringFieldUpdateOperationsInput | string | null
    enabled?: BoolFieldUpdateOperationsInput | boolean
    notifyHoursBefore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarShareUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedWith?: UserUpdateOneRequiredWithoutSharedWithMeNestedInput
  }

  export type CalendarShareUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarShareUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarShareUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutSharedByMeNestedInput
  }

  export type CalendarShareUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarShareUncheckedUpdateManyWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    permission?: EnumSharePermissionFieldUpdateOperationsInput | $Enums.SharePermission
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubEventCreateManyParentEventInput = {
    id?: string
    title: string
    kind: string
    dueAt?: Date | string | null
    status?: string
    priority?: number
    ruleId?: string | null
    ruleParams?: string | null
    explanation?: string | null
    createdBy?: string
    locked?: boolean
    isPlaceholder?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RinvioCreateManyParentEventInput = {
    id?: string
    numero: number
    dataUdienza: Date | string
    tipoUdienza: string
    tipoUdienzaCustom?: string | null
    note?: string | null
    adempimenti?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubEventUpdateWithoutParentEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    locked?: BoolFieldUpdateOperationsInput | boolean
    isPlaceholder?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubEventUncheckedUpdateWithoutParentEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    locked?: BoolFieldUpdateOperationsInput | boolean
    isPlaceholder?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubEventUncheckedUpdateManyWithoutParentEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    ruleId?: NullableStringFieldUpdateOperationsInput | string | null
    ruleParams?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    locked?: BoolFieldUpdateOperationsInput | boolean
    isPlaceholder?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RinvioUpdateWithoutParentEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    dataUdienza?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoUdienza?: StringFieldUpdateOperationsInput | string
    tipoUdienzaCustom?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    adempimenti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RinvioUncheckedUpdateWithoutParentEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    dataUdienza?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoUdienza?: StringFieldUpdateOperationsInput | string
    tipoUdienzaCustom?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    adempimenti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RinvioUncheckedUpdateManyWithoutParentEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    dataUdienza?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoUdienza?: StringFieldUpdateOperationsInput | string
    tipoUdienzaCustom?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    adempimenti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventCountOutputTypeDefaultArgs instead
     */
    export type EventCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventDefaultArgs instead
     */
    export type EventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubEventDefaultArgs instead
     */
    export type SubEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RinvioDefaultArgs instead
     */
    export type RinvioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RinvioDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SettingDefaultArgs instead
     */
    export type SettingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SettingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDeviceDefaultArgs instead
     */
    export type NotificationDeviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDeviceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventNotificationPreferenceDefaultArgs instead
     */
    export type EventNotificationPreferenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventNotificationPreferenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CalendarShareDefaultArgs instead
     */
    export type CalendarShareArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CalendarShareDefaultArgs<ExtArgs>

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