const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/biblioteca')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const livroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  ano: { type: Number, required: true },
  genero: { type: String, required: true }
});

const estudanteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  curso: { type: String, required: true },
  ano: { type: Number, required: true }
});

const aluguelSchema = new mongoose.Schema({
  idLivro: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
  idEstudante: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudante', required: true },
  dataAluguel: { type: String, required: true },
  dataDevolucao: { type: String }
});

const Livro = mongoose.model('Livro', livroSchema);
const Estudante = mongoose.model('Estudante', estudanteSchema);
const Aluguel = mongoose.model('Aluguel', aluguelSchema);

// Rotas para Livros
app.post('/livros', async (req, res) => {
  try {
    const livro = new Livro(req.body);
    await livro.save();
    res.status(201).json(livro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.find();
    res.status(200).json(livros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/livros/:id', async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
    res.status(200).json(livro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/livros/:id', async (req, res) => {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id);
    if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
    res.status(200).json({ message: 'Livro deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Estudantes
app.post('/estudantes', async (req, res) => {
  try {
    const estudante = new Estudante(req.body);
    await estudante.save();
    res.status(201).json(estudante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/estudantes', async (req, res) => {
  try {
    const estudantes = await Estudante.find();
    res.status(200).json(estudantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/estudantes/:id', async (req, res) => {
  try {
    const estudante = await Estudante.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!estudante) return res.status(404).json({ message: 'Estudante não encontrado' });
    res.status(200).json(estudante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/estudantes/:id', async (req, res) => {
  try {
    const estudante = await Estudante.findByIdAndDelete(req.params.id);
    if (!estudante) return res.status(404).json({ message: 'Estudante não encontrado' });
    res.status(200).json({ message: 'Estudante deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Aluguéis
app.post('/alugueis', async (req, res) => {
  try {
    const aluguel = new Aluguel(req.body);
    await aluguel.save();
    res.status(201).json(aluguel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/alugueis', async (req, res) => {
  try {
    const alugueis = await Aluguel.find().populate('idLivro').populate('idEstudante');
    res.status(200).json(alugueis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/alugueis/:id', async (req, res) => {
  try {
    const aluguel = await Aluguel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aluguel) return res.status(404).json({ message: 'Aluguel não encontrado' });
    res.status(200).json(aluguel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/alugueis/:id', async (req, res) => {
  try {
    const aluguel = await Aluguel.findByIdAndDelete(req.params.id);
    if (!aluguel) return res.status(404).json({ message: 'Aluguel não encontrado' });
    res.status(200).json({ message: 'Aluguel deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});