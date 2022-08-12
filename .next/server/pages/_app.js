"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 758:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "@ant-design/icons"
var icons_ = __webpack_require__(66);
// EXTERNAL MODULE: external "antd"
var external_antd_ = __webpack_require__(725);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(689);
;// CONCATENATED MODULE: external "next/head"
const head_namespaceObject = require("next/head");
var head_default = /*#__PURE__*/__webpack_require__.n(head_namespaceObject);
;// CONCATENATED MODULE: ./components/HeadMeta.js


function HeadMeta() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)((head_default()), {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("title", {
                children: "LFortran"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                name: "description",
                content: "This is LFortran Compiler"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("link", {
                rel: "icon",
                href: "/favicon.ico"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                name: "viewport",
                content: "width=device-width, initial-scale=1.0"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                charSet: "UTF-8"
            })
        ]
    });
}
/* harmony default export */ const components_HeadMeta = (HeadMeta);

;// CONCATENATED MODULE: ./components/MyHeader.js





const items = [
    {
        label: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(icons_.HomeOutlined, {}),
                " LFortran"
            ]
        }),
        key: "1"
    }
];
function MyHeader() {
    const { 0: current , 1: setCurrent  } = (0,external_react_.useState)("1");
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(components_HeadMeta, {}),
            /*#__PURE__*/ jsx_runtime_.jsx(external_antd_.Menu, {
                theme: "dark",
                selectedKeys: [
                    current
                ],
                mode: "horizontal",
                items: items
            })
        ]
    });
}
/* harmony default export */ const components_MyHeader = (MyHeader);

;// CONCATENATED MODULE: external "antd/lib/layout/layout"
const layout_namespaceObject = require("antd/lib/layout/layout");
;// CONCATENATED MODULE: ./components/MyFooter.js

// import { Col, Row } from "antd";
// function MyFooter() {
//     return (
//         <Row
//             style={{
//                 textAlign: "center",
//                 position: "absolute",
//                 width: "100%",
//                 bottom: "0px",
//                 padding: "10px",
//                 backgroundColor: "grey"
//             }}
//         >
//             <Col span={24}><b>LFortran by LCompilers</b></Col>
//         </Row>
//     );
// }

function MyFooter() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(layout_namespaceObject.Footer, {
        style: {
            backgroundColor: "#001529",
            color: "#fff",
            padding: "10px 0px",
            textAlign: "center",
            width: "100%"
        },
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("a", {
                href: "https://lfortran.org/",
                children: "LFortran"
            }),
            " by ",
            /*#__PURE__*/ jsx_runtime_.jsx("a", {
                href: "https://lcompilers.org/",
                children: "LCompilers"
            })
        ]
    });
}
/* harmony default export */ const components_MyFooter = (MyFooter);

;// CONCATENATED MODULE: ./components/MyLayout.js





function MyLayout({ children  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_antd_.Layout, {
        style: {
            backgroundColor: "inherit"
        },
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(components_MyHeader, {}),
            /*#__PURE__*/ jsx_runtime_.jsx(layout_namespaceObject.Content, {
                style: {
                    padding: "10px 20px"
                },
                children: children
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(components_MyFooter, {})
        ]
    });
}
/* harmony default export */ const components_MyLayout = (MyLayout);

;// CONCATENATED MODULE: ./pages/_app.js



function MyApp({ Component , pageProps  }) {
    return /*#__PURE__*/ jsx_runtime_.jsx(components_MyLayout, {
        children: /*#__PURE__*/ jsx_runtime_.jsx(Component, {
            ...pageProps
        })
    });
}
/* harmony default export */ const _app = (MyApp);


/***/ }),

/***/ 66:
/***/ ((module) => {

module.exports = require("@ant-design/icons");

/***/ }),

/***/ 725:
/***/ ((module) => {

module.exports = require("antd");

/***/ }),

/***/ 689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(758));
module.exports = __webpack_exports__;

})();