import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/user/user.interface';
import { ResponseMessage } from 'src/decorator/response.message.decorator';
import { Public } from 'src/decorator/customize';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }
  @Public()
  @Get()
  @ResponseMessage('Fetch list company')
  findAll(@Query() qs: string,
@Query('pageSize') limit: number,
@Query('current') currentPage: number) {
   
    return this.companiesService.findAll(qs, +limit , +currentPage);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.companiesService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user:IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user:IUser) {
    
    return this.companiesService.remove(id, user);
  }
 
}
