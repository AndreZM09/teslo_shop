import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example:'02908085-fa6a-4abf-ad87-e926a6279129',
        description:'Prduct ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'T-Shirt Teslo',
        description:'Prduct Title',
        uniqueItems:true
    })
    @Column('text', {
        unique:true
    })
    title:string;

    @ApiProperty({
        example:0,
        description:'Prduct Price'
    })
    @Column('float',{
        default:0
    })
    price:number;

    @ApiProperty({
        example:'Lorem csaiuohggewiufgqw df98qwe guqwefg',
        description:'Prduct Description',
        default:null
    })
    @Column({
        type:'text',
        nullable:true
    })
    description:string

    @ApiProperty({
        example:'t_shirt_teslo',
        description:'Prduct Slug - for SEO',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    slug:string;

    @ApiProperty({
        example:10,
        description:'Prduct Stock',
        default:0
    })
    @Column('int',{
        default:0
    })
    stock:number

    @ApiProperty({
        example:['M','XL','XXL'],
        description:'Prduct Sizes',
        uniqueItems:true
    })
    @Column('text',{
        array:true
    })
    sizes: string[]

    @ApiProperty({
        example:'women',
        description:'Prduct Gender',
        uniqueItems:true
    })
    @Column('text')
    gender:string;

    @ApiProperty()
    @Column({
        type:'text',
        array:true,
        default:[]
    })
    tags:string[]

    @ApiProperty()
    @OneToMany(
        ()=>ProductImage,
        productImage=> productImage.product,
        {cascade:true, eager:true}
    )
    images?: ProductImage[]

    @ManyToOne(
        ()=> User,
        (user)=>user.products,
        {eager:true}
    )
    user:User

    @BeforeInsert()
    checkSlugInsert() {
        if(!this.slug){
            this.slug=this.title
        }

        this.slug=this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug=this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
    }
   
}
