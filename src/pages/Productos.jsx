import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShoppingBag, Loader, AlertCircle } from 'lucide-react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: '',
    imagen_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      // Petición al back
      const response = await api.get('/productos/');
      
      // Axios guarda la respuesta del servidor en .data
      // Si tu backend manda el array directo, usamos response.data o response
      const datosRecibidos = response.data || response;
      
      console.log("Datos recibidos del Back:", datosRecibidos);
      setProductos(Array.isArray(datosRecibidos) ? datosRecibidos : []);
      
    } catch (err) {
      console.error("Error en la petición:", err);
      setError("No se pudo conectar con el servidor. ¿Está encendido el Back?");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2">
      <AlertCircle /> {error}
    </div>
  );

  const handleToggleForm = () => {
    setShowForm(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/productos', formData);
      setFormData({ nombre: '', precio: '', descripcion: '', stock: '', imagen_url: '' });
      setShowForm(false);
      cargarProductos(); 
    } catch (err) {
      console.error('Error creando producto:', err);
      setError('No se pudo crear el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> Inventario
        </h1>
        <div className="flex items-center gap-4">
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={handleToggleForm}
          >
            Nuevo
          </button>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {productos.length} items
          </span>
        </div>
      </header>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nombre</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Precio</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded px-2 py-1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded px-2 py-1"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Stock</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">URL imagen</label>
              <input
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-1 border rounded"
              onClick={handleToggleForm}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </form>
      )}
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((prod) => (
          <div key={prod.id || prod._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden flex flex-col">
            
            <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50">
              <img 
                src={prod.image || prod.imagen_url || "https://via.placeholder.com/150"} 
                alt={prod.title || prod.nombre} 
                className="max-h-full object-contain"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={prod.title || prod.nombre}>
                  {prod.title || prod.nombre}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
                  ${prod.price || prod.precio}
                </span>
              </div> 
              
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                {prod.description || prod.descripcion || "Sin descripción disponible."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-xs font-medium text-slate-400">
                  Stock: <span className={(prod.stock || 0) < 10 ? "text-red-500 font-bold" : "text-slate-600"}>
                    {prod.stock || 0}
                  </span>
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && !error && (
        <div className="text-center py-20 text-slate-500">
          No hay productos disponibles en el inventario.
        </div>
      )}
    </div>
  );
};

export default Productos;
