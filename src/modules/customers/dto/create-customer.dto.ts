
import { IsString, IsEmail, IsOptional, IsNotEmpty, IsPhoneNumber, IsNumber, isString } from 'class-validator';
import { Type } from 'class-transformer';



//Nest recibe los valores del body como strings 
export class CreateCustomerDto {


    @IsString()
    @IsNotEmpty({ message: 'This name is required' })
    FirstName: string;

    @IsString()
    @IsNotEmpty({ message: 'This last name is required' })
    LastName: string;


    //Nest siempre recibe el codigo por string y lo convierte a number
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty({ message: 'This company ID is required' })
    Company: string;

    @IsString()
    @IsOptional()
    Address: string;

    @IsString()
    City: string;

    @IsString()
    @IsOptional()
    State: string;

    @IsString()
    @IsOptional()
    Country: string;

    @IsString()
    @IsOptional()
    PostalCode: string;

    @IsString()
    @IsOptional()
    Phone: string;

    @IsString()
    @IsOptional()
    Fax: string;

    @IsEmail()
    @IsOptional()
    Email: string;


}
