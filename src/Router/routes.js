import { consolasController } from "../Views/Consolas/consolasController";
import { crearConsolasController } from "../Views/Consolas/Crear/crearConsolasController";
import { consolasEditarController } from "../Views/Consolas/Editar/consolaEditarController";
import { historialController } from "../Views/Historial/historialController";
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
            private:true
        },
        Crear:{
            path:'Reservas/Crear/index.html',
            controlador:crearReservaController,
            private:true
        },
        Consumos:{
            path:'Reservas/Consumos/index.html',
            controlador:consumosController,
            private:true
        }
    },
    Consolas:{
        "/":{
            path:'Consolas/index.html',
            controlador:consolasController,
            private:true
        },
        Crear:{
            path:'Consolas/Crear/index.html',
            controlador:crearConsolasController,
            private:true
        },
        Editar:{
            path:'Consolas/Editar/index.html',
            controlador:consolasEditarController,
            private:true
        }
    },
    Productos:{
        "/":{
            path:'Productos/index.html',
            controlador:productosController,
            private:true
        },
        Crear:{
            path:'Productos/Crear/index.html',
            controlador:crearProductosController,
            private:true
        },
        Editar:{
            path:'Productos/Editar/index.html',
            controlador:productosEditarController,
            private:true
        }
    },
    Usuarios:{
        "/":{
            path:'Usuarios/index.html',
            controlador:usuariosController,
            private:true
        },
        Crear:{
            path:'Usuarios/Crear/index.html',
            controlador:crearUsuarioController,
            private:true
        },
        Editar:{
            path:'Usuarios/Editar/index.html',
            controlador:usuariosEditarController,
            private:true
        }
    },
    Tipos:{
        "/":{
            path:'Tipos/index.html',
            controlador:tiposController,
            private:true
        },
        Crear:{
            path:'Tipos/Crear/index.html',
            controlador:crearTiposController,
            private:true
        },
        Editar:{
            path:'Tipos/Editar/index.html',
            controlador:tiposEditarController,
            private:true
        }
    },
    Historial:{
        path:"Historial/index.html",
        controlador:historialController,
        private:true
    }
}