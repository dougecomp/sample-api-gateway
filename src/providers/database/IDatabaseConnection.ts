export interface IDatabaseConnectionConfig {
    host: string;
  }

export interface IDatabaseConnection {
  connect(config?: IDatabaseConnectionConfig): Promise<boolean>;
  disconnect(): Promise<void>;
}
