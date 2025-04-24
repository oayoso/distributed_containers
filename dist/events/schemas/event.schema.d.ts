import { Schema } from 'mongoose';
export declare const EventSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    containerId: string;
    statusHistory: import("mongoose").Types.DocumentArray<{
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }, import("mongoose").Types.Subdocument<import("mongoose").Types.ObjectId, any, {
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }> & {
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }>;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    containerId: string;
    statusHistory: import("mongoose").Types.DocumentArray<{
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }, import("mongoose").Types.Subdocument<import("mongoose").Types.ObjectId, any, {
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }> & {
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }>;
}>> & import("mongoose").FlatRecord<{
    containerId: string;
    statusHistory: import("mongoose").Types.DocumentArray<{
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }, import("mongoose").Types.Subdocument<import("mongoose").Types.ObjectId, any, {
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }> & {
        state?: string | null | undefined;
        timestamp?: NativeDate | null | undefined;
        source?: string | null | undefined;
    }>;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
