const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log('Erreur:', err));

const produitSchema = new mongoose.Schema({}, { collection: 'produits', strict: false });
const commandeSchema = new mongoose.Schema({}, { collection: 'commandes', strict: false });

const Produit = mongoose.model('Produit', produitSchema);
const Commande = mongoose.model('Commande', commandeSchema);

app.get('/api/produits', async (req, res) => {
  try {
    const produits = await Produit.find({ actif: true });
    console.log('Produits trouvés:', produits.length);
    res.json(produits);
  } catch(err) {
    console.log('Erreur produits:', err.message);
    res.json([]);
  }
});

app.get('/', (req, res) => {
  res.send('API Keur Ndaay en ligne ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Serveur sur port ' + PORT));
