import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IStoreSettings extends Document {
  storeName: string;
  announcementBar: {
    text: string;
    link: string;
    isActive: boolean;
    backgroundColor: string;
    textColor: string;
  };
  heroBanner: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    codEnabled: boolean;
    codFee: number;
  };
  socialLinks: {
    instagram?: string;
    discord?: string;
    twitter?: string;
    youtube?: string;
  };
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: 'Amice Amarine' },
    announcementBar: {
      text: { type: String, default: '🔥 FLASH SALE: FLAT 15% OFF ON PREPAID ORDERS | FREE SHIPPING OVER ₹999' },
      link: { type: String, default: '/collections/all-products' },
      isActive: { type: Boolean, default: true },
      backgroundColor: { type: String, default: '#09090b' },
      textColor: { type: String, default: '#ffffff' },
    },
    heroBanner: {
      headline: { type: String, default: 'AMICE AMARINE // ANIME X STREETWEAR' },
      subheadline: { type: String, default: 'Heavyweight 280 GSM Cotton. Raw Tokyo Cyberpunk Aesthetics. Oversized Precision.' },
      ctaText: { type: String, default: 'SHOP THE DROP' },
      ctaLink: { type: String, default: '/collections/all-products' },
      backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop' },
    },
    shipping: {
      freeShippingThreshold: { type: Number, default: 999 },
      standardShippingFee: { type: Number, default: 99 },
      codEnabled: { type: Boolean, default: true },
      codFee: { type: Number, default: 50 },
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/amiceamarine' },
      discord: { type: String, default: 'https://discord.gg/amiceamarine' },
      twitter: { type: String, default: 'https://twitter.com/amiceamarine' },
    },
  },
  {
    timestamps: true,
  }
);

export const StoreSettings: Model<IStoreSettings> = mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
