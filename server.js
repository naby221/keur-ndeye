const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log(err));

// Modèle Produit
const Produit = mongoose.model('Produit', {
  nom: String,
  categorie: String,
  prix: Number,
  volume: String,
  image: String,
  actif: { type: Boolean, default: true }
});

// Modèle Commande
const Commande = mongoose.model('Commande', {
  client: {
    nom: String,
    telephone: String,
    adresse: String
  },
  articles: Array,
  total: Number,
  livraison: Number,
  paiement: String,
  statut: { type: String, default: 'en_attente' },
  date: { type: Date, default: Date.now }
});

// Routes API
app.get('/api/produits', async (req, res) => {
  const produits = await Produit.find({ actif: true });
  res.json(produits);
});

app.post('/api/commandes', async (req, res) => {
  const commande = await Commande.create(req.body);
  res.json(commande);
});

app.get('/api/commandes', async (req, res) => {
  const commandes = await Commande.find().sort({ date: -1 });
  res.json(commandes);
});

app.get('/', (req, res) => {
  res.send('API Keur Ndaay en ligne ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Serveur démarré sur le port ' + PORT));