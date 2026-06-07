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

/* ==========================
   PRODUITS
========================== */

// Voir tous les produits
app.get('/api/produits', async (req, res) => {
  try {

    const search = req.query.search || '';

    const produits = await Produit.find({
      nom: {
        $regex: search,
        $options: 'i'
      }
    });

    res.json(produits);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Erreur serveur'
    });

  }
});
// Ajouter un produit
app.post('/api/produits', async (req, res) => {
  try {
    const produit = await Produit.create(req.body);

    res.json({
      success: true,
      produit
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Modifier un produit
app.put('/api/produits/:id', async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      produit
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Supprimer un produit
app.delete('/api/produits/:id', async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Produit supprimé'
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* ==========================
   COMMANDES
========================== */

// Voir toutes les commandes
app.get('/api/commandes', async (req, res) => {
  try {

    const statut = req.query.statut;

    let filtre = {};

    if (statut) {
      filtre.statut = statut;
    }

    const commandes = await Commande.find(filtre)
      .sort({ date: -1 });

    res.json(commandes);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Erreur serveur'
    });

  }
});
// Ajouter une commande
app.post('/api/commandes', async (req, res) => {
  try {
    const commande = await Commande.create(req.body);

    res.json({
      success: true,
      commande
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Modifier une commande (statut)
app.put('/api/commandes/:id', async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      commande
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Supprimer une commande
app.delete('/api/commandes/:id', async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Commande supprimée'
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* ==========================
   SERVEUR
========================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
