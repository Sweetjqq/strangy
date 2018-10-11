export const createValidator = (rules = []) => {
    return (rule, value, callback) => {
        rules.forEach(rule => {
            if (!rule.expression.test(value)) {
                return callback(rule.message)
            }
        })
        callback()
    }
}