import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Post()
  create(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.developersService.create(createDeveloperDto);
  }

 @UseGuards(AuthGuard, new RoleGuard('admin')) // Somente admins podem listar usuários
@Get()
async findAll(@Req() req) {
  return this.developersService.findAll();
}

  @UseGuards(AuthGuard) 
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('Você só pode acessar seu próprio perfil');
    }
    const developer = await this.developersService.findOne(id);
    if (!developer) throw new NotFoundException();
    return developer;
  }

  @UseGuards(AuthGuard) //  Protege a atualização
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
    @Req() req
  ) {
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('Você só pode editar seu próprio perfil');
    }
    const developer = await this.developersService.update(id, updateDeveloperDto);
    if (!developer) throw new NotFoundException();
    return developer;
  }

  @UseGuards(AuthGuard, new RoleGuard('admin')) // Somente admins podem excluir usuários
@Delete(':id')
async remove(@Param('id') id: string) {
  return this.developersService.remove(id);
  }  
}
