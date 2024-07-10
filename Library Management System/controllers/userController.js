const {Book,Returnbook}=require('../models/index');

exports.createBook=async(req,res)=>{
    try {
        const book=await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({Error:'Error creating book'});
    }
}
exports.getBooks=async(req,res)=>{
    try {
        const books=await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({Error:'Error getting books'});
    }
}
exports.deleteBook=async(req,res)=>{
    try {
        const bookId=req.params.id;
        await Book.destroy({where:{id:bookId}});
        res.status(204).json();
    } catch (error) {
        res.status(500).json({Error:'Error deleting book'}); 
    }
}
exports.createReturnBook=async(req,res)=>{
    try {
        const retbook=await Returnbook.create(req.body);
        res.status(201).json(retbook);
    } catch (error) {
        res.status(500).json({Error:'Error posting return book'});
    }
}
exports.getReturnBooks=async(req,res)=>{
    try {
        const rbooks=await Returnbook.findAll();
        res.status(200).json(rbooks);
    } catch (error) {
        res.status(500).json({Error:'Error getting returned books'});
    }
}
