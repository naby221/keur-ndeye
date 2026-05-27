const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ MongoDB connecté');
})
.catch((err) => {
  console.log('❌ Erreur MongoDB :', err);
});

const produitSchema = new mongoose.Schema(
  {},
  {
    collection: 'produits',
    strict: false
  }
);

const commandeSchema = new mongoose.Schema(
  {},
  {
    collection: 'commandes',
    strict: false
  }
);

const Produit = mongoose.model('Produit', produitSchema);
const Commande = mongoose.model('Commande', commandeSchema);

app.get('/', (req, res) => {
  res.send('API Keur Ndaay en ligne ✅');
});

app.get('/api/produits', async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

app.get('/api/commandes', async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.json(commandes);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
