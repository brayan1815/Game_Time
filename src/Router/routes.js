import { consolasController } from "../Views/Consolas/consolasController";
import { crearConsolasController } from "../Views/Consolas/Crear/crearConsolasController";
import { consolasEditarController } from "../Views/Consolas/Editar/consolaEditarController";
import { historialController } from "../Views/Historial/historialController";
import { historialInfoController } from "../Views/Historial/Info/historialInfoController";
import { loginController } from "../Views/Login/loginController";
import { crearProductosController } from "../Views/Productos/Crear/crearProductosController";
import { productosEditarController } from "../Views/Productos/Editar/productosEditarController";
import { productosController } from "../Views/Productos/productosController";
import { registroController } from "../Views/Registro/registroController";
import { consumosController } from "../Views/Reservas/Consumos/consumosController";
import { crearReservaController } from "../Views/Reservas/Crear/crearReservasController";
import { reservasController } from "../Views/Reservas/reservasController";
import { crearTiposController } from "../Views/Tipos/Crear/crearTiposController";
import { tiposEditarController } from "../Views/Tipos/Editar/tiposEditarController";
import { tiposController } from "../Views/Tipos/tiposController";
import { crearUsuarioController } from "../Views/Usuarios/Crear/crearUsuarioController";
import { usuariosEditarController } from "../Views/Usuarios/Editar/usuarioEditarController";
import { usuariosController } from "../Views/Usuarios/usuariosController";

export const routes={
    Login:{
        path:'Login/index.html',
        controlador:loginController,
        private:false
    },
    Registro:{
        path:'Registro/index.html',
        controlador:registroController,
        private:false
    },
    Reservas:{
        "/":{
            path:'Reservas/index.html',
            controlador:reservasController,
            private:true,
            can:"reservas.index"
        },
        Crear:{
            path:'Reservas/Crear/index.html',
            controlador:crearReservaController,
            private:true,
            can:"reservas.crear"
        },
        Consumos:{
            path:'Reservas/Consumos/index.html',
            controlador:consumosController,
            private:true,
            can:'consumos.index'
        }
    },
    Consolas:{
        "/":{
            path:'Consolas/index.html',
            controlador:consolasController,
            private:true,
            can:'consolas.index'
        },
        Crear:{
            path:'Consolas/Crear/index.html',
            controlador:crearConsolasController,
            private:true,
            can:'consolas.crear'
        },
        Editar:{
            path:'Consolas/Editar/index.html',
            controlador:consolasEditarController,
            private:true,
            can:'consolas.editar'
        }
    },
    Productos:{
        "/":{
            path:'Productos/index.html',
            controlador:productosController,
            private:true,
            can:'productos.index'
        },
        Crear:{
            path:'Productos/Crear/index.html',
            controlador:crearProductosController,
            private:true,
            can:'productos.crear'
        },
        Editar:{
            path:'Productos/Editar/index.html',
            controlador:productosEditarController,
            private:true,
            can:'productos.editar'
        }
    },
    Usuarios:{
        "/":{
            path:'Usuarios/index.html',
            controlador:usuariosController,
            private:true,
            can:'usuarios.index'
        },
        Crear:{
            path:'Usuarios/Crear/index.html',
            controlador:crearUsuarioController,
            private:true,
            can:'usuarios.crear'
        },
        Editar:{
            path:'Usuarios/Editar/index.html',
            controlador:usuariosEditarController,
            private:true,
            can:'usuarios.editar'
        }
    },
    Tipos:{
        "/":{
            path:'Tipos/index.html',
            controlador:tiposController,
            private:true,
            can:'tipos.index'
        },
        Crear:{
            path:'Tipos/Crear/index.html',
            controlador:crearTiposController,
            private:true,
            can:'tipos.crear'
        },
        Editar:{
            path:'Tipos/Editar/index.html',
            controlador:tiposEditarController,
            private:true,
            can:'tipos.editar'
        }
    },
    Historial:{
        "/":{
            path:"Historial/index.html",
            controlador:historialController,
            private:true,
            can:'historial.index'
        },
        Info:{
            path:"Historial/Info/index.html",
            controlador:historialInfoController,
            private:true,
            can:'historial.index'
        }
    }
}