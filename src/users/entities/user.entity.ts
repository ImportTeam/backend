export class UserEntity {
  seq: string;
  uuid: string;
  email?: string | null;
  name: string;
  social_provider: string;
  created_at: Date;
  updated_at: Date;

  constructor(p: any) {
    this.seq = p.seq?.toString?.() ?? String(p.seq);
    this.uuid = p.uuid;
    this.email = p.email;
    this.name = p.name;
    this.social_provider = p.social_provider;
    this.created_at = p.created_at;
    this.updated_at = p.updated_at;
  }
}
