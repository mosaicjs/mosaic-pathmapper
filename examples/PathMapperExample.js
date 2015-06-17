import { PathMapper } from '../';

let mapper = new PathMapper();
let projectHandler = function(params){
    console.log('- Project Name: ', params.projectName);
    console.log('- Project Path: ', params.path);
}
mapper.add('/project/:projectName/*path', projectHandler);
let result = mapper.find('/project/FooBar/path/to/my/doc.pdf');
console.log('Result : ', result);
/* 
 * The result should be:
 * { 
 *   params: { projectName: 'FooBar', path: 'path/to/my/doc.pdf' }, 
 *   obj: [Function: projectHandler]
 * }
*/

result.obj(result.params);
/*
 * The projectHandler method should write the following text in the console:
 * - Project Name: FooBar
 * - Project Path: path/to/my/doc.pdf
 */
 
