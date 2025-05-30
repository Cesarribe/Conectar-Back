import { Injectable } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Repository } from 'typeorm';
import { Developer } from './entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private readonly repository: Repository<Developer>,
  ) {}

  async create(dto: CreateDeveloperDto) {
    const developer = this.repository.create(dto);
    return await this.repository.save(developer);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string | number) {
    const developer = await this.repository.findOneBy({ id: Number(id) }); // ✅ Converte para número, se necessário
    return developer || null; // ✅ Retorna `null` se não encontrar
  }

  async update(id: string | number, dto: UpdateDeveloperDto) {
    const developer = await this.repository.findOneBy({ id: Number(id) }); // ✅ Converte para número, se necessário
    if (!developer) return null;

    this.repository.merge(developer, dto); // ✅ Atualiza apenas os campos modificados
    return await this.repository.save(developer);
  }

  async remove(id: string | number) {
    const developer = await this.repository.findOneBy({ id: Number(id) }); // ✅ Converte para número, se necessário
    if (!developer) return null;

    return await this.repository.remove(developer);
  }
}
