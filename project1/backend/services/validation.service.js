
import {z} from "zod";

export const slotSchema=z.object({
            time: z.string(),
            isBooked: z.boolean().optional().default(false)
        })

export const availabilityValidation=z.object({
    availability: z.array(z.object({
        date: z.string(),
        slots: z.array(slotSchema)
    }))
})

export const doctorValidation=z.object(
    {
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        gender: z.enum(["male", "female", "other"]),
        specialization: z.string(),
        experience: z.number(),
        contactNumber: z.string().length(10),
        availability: z.array(z.object({
            date: z.string(),
            slots: z.array(slotSchema)
        })).optional()
    }
)

export const parsedValidation = (schema,data)=>{
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
        throw new Error(JSON.stringify(parsed.error.format()))
    }
    return parsed.data
}