import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/user.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>){}
  async create(createCompanyDto: CreateCompanyDto, user:IUser):Promise<Company> {
    console.log(user)
    const company = new this.companyModel({...createCompanyDto,
    createdBy:{
      _id: user._id,
      email: user.email,
    }
    })
    await company.save()
    return company;
  }
  async update(id: string, updateCompanyDto: UpdateCompanyDto, user:IUser) {
     
    const update = await this.companyModel.updateOne({_id:id},{...updateCompanyDto,
      updatedBy:{
        _id: user._id,
        email: user.email
      }
    })
    
    return update;
  }
  
  async findAll(qs: string, limit: number, currentPage: number ) {
    const { filter, sort, population } = aqp(qs);
    console.log(qs, limit, currentPage)

    delete filter.current;
    delete filter.pageSize;
    console.log(filter)
    const offset = (currentPage-1)*limit
    const defaultLimit = limit ? limit : 10
    const totalCompany = (await this.companyModel.find(filter)).length
    const totalPages = Math.ceil(totalCompany/defaultLimit)
    const name = filter.name+''
    const result = await this.companyModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .populate(population)
    .exec()
    console.log(result)
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalCompany
      },
      result
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  

  async remove(id: string, user:IUser) {
    await this.companyModel.updateOne({_id: id},{
      deletedBy:{
        _id: user._id,
        email: user.email
      }
    })
    return await this.companyModel.softDelete({_id:id})
     
  }
 
}
// 68 4:18
