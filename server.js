const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log('Erreur MongoDB:', err));

// Modèle Produit
const produitSchema = new mongoose.Schema({
  nom: String,
  categorie: String,
  prix: Number,
  volume: String,
  image: String,
  actif: Boolean
});
const Produit = mongoose.model('Produit', produitSchema);

// Modèle Commande
const commandeSchema = new mongoose.Schema({
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
const Commande = mongoose.model('Commande', commandeSchema);

// Routes API
app.get('/api/produits', async (req, res) => {
  try {
    const produits = await Produit.find({ actif: true });
    res.json(produits);
  } catch(err) {
    res.json([]);
  }
});

app.post('/api/commandes', async (req, res) => {
  try {
    const commande = await Commande.create(req.body);
    res.json(commande);
  } catch(err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

app.get('/api/commandes', async (req, res) => {
  try {
    const commandes = await Commande.find().sort({ date: -1 });
    res.json(commandes);
  } catch(err) {
    res.json([]);
  }
});

app.get('/', (req, res) => {
  res.send('API Keur Ndaay en ligne ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Serveur démarré sur le port ' + PORT));
