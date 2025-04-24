export interface IRabbitMQProducerService {
    emit(pattern: string, message: any): Promise<any>;
}
