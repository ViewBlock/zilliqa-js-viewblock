export default (t, obj, fields) => fields.forEach(field => t.truthy(obj[field]))
