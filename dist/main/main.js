module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "06c6a93e9e17325b7aaa";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixtQkFBTyxDQUFDLDBGQUEwQzs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7OztBQUdELGtCQUFrQixtQkFBTyxDQUFDLDBHQUFrRCxZQUFZOzs7QUFHeEY7QUFDQSxTQUFTLHVCQUFnQjtBQUN6QixDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8gX190cy1iYWJlbEA2LjAuNFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./public/express/database/database.js":
/*!*********************************************!*\
  !*** ./public/express/database/database.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _queries_book__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./queries/book */ \"./public/express/database/queries/book.js\");\n\n\nvar sqlite3 = __webpack_require__(/*! sqlite3 */ \"sqlite3\").verbose();\n\nconst DBSOURCE = \"db.sqlite\";\nlet db = new sqlite3.Database(DBSOURCE, err => {\n  if (err) {\n    // Cannot open database\n    console.error(err.message);\n    throw err;\n  } else {\n    console.log(\"Connected to the SQLite database.\");\n    db.run(_queries_book__WEBPACK_IMPORTED_MODULE_0__[\"initializeBookQuery\"]);\n    console.log(\"Initialized schema.\");\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (db);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvZXhwcmVzcy9kYXRhYmFzZS9kYXRhYmFzZS5qcz8zMjNlIl0sIm5hbWVzIjpbInNxbGl0ZTMiLCJyZXF1aXJlIiwidmVyYm9zZSIsIkRCU09VUkNFIiwiZGIiLCJEYXRhYmFzZSIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsIm1lc3NhZ2UiLCJsb2ciLCJydW4iLCJpbml0aWFsaXplQm9va1F1ZXJ5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7O0FBRUEsSUFBSUEsT0FBTyxHQUFHQyxtQkFBTyxDQUFDLHdCQUFELENBQVAsQ0FBbUJDLE9BQW5CLEVBQWQ7O0FBRUEsTUFBTUMsUUFBUSxHQUFHLFdBQWpCO0FBRUEsSUFBSUMsRUFBRSxHQUFHLElBQUlKLE9BQU8sQ0FBQ0ssUUFBWixDQUFxQkYsUUFBckIsRUFBZ0NHLEdBQUQsSUFBUztBQUMvQyxNQUFJQSxHQUFKLEVBQVM7QUFDUDtBQUNBQyxXQUFPLENBQUNDLEtBQVIsQ0FBY0YsR0FBRyxDQUFDRyxPQUFsQjtBQUNBLFVBQU1ILEdBQU47QUFDRCxHQUpELE1BSU87QUFDTEMsV0FBTyxDQUFDRyxHQUFSLENBQVksbUNBQVo7QUFDQU4sTUFBRSxDQUFDTyxHQUFILENBQU9DLGlFQUFQO0FBRUFMLFdBQU8sQ0FBQ0csR0FBUixDQUFZLHFCQUFaO0FBQ0Q7QUFDRixDQVhRLENBQVQ7QUFhZU4saUVBQWYiLCJmaWxlIjoiLi9wdWJsaWMvZXhwcmVzcy9kYXRhYmFzZS9kYXRhYmFzZS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRpYWxpemVCb29rUXVlcnkgfSBmcm9tIFwiLi9xdWVyaWVzL2Jvb2tcIjtcclxuXHJcbnZhciBzcWxpdGUzID0gcmVxdWlyZShcInNxbGl0ZTNcIikudmVyYm9zZSgpO1xyXG5cclxuY29uc3QgREJTT1VSQ0UgPSBcImRiLnNxbGl0ZVwiO1xyXG5cclxubGV0IGRiID0gbmV3IHNxbGl0ZTMuRGF0YWJhc2UoREJTT1VSQ0UsIChlcnIpID0+IHtcclxuICBpZiAoZXJyKSB7XHJcbiAgICAvLyBDYW5ub3Qgb3BlbiBkYXRhYmFzZVxyXG4gICAgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGVkIHRvIHRoZSBTUUxpdGUgZGF0YWJhc2UuXCIpO1xyXG4gICAgZGIucnVuKGluaXRpYWxpemVCb29rUXVlcnkpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6ZWQgc2NoZW1hLlwiKTtcclxuICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGI7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./public/express/database/database.js\n");

/***/ }),

/***/ "./public/express/database/queries/book.js":
/*!*************************************************!*\
  !*** ./public/express/database/queries/book.js ***!
  \*************************************************/
/*! exports provided: initializeBookQuery, insertBookQuery, deleteBookByIdQuery, getBookByIdQuery, getBooksQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initializeBookQuery\", function() { return initializeBookQuery; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"insertBookQuery\", function() { return insertBookQuery; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteBookByIdQuery\", function() { return deleteBookByIdQuery; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getBookByIdQuery\", function() { return getBookByIdQuery; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getBooksQuery\", function() { return getBooksQuery; });\nconst initializeBookQuery = `create table if not exists book (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    title text,\n    author text,\n    description text,\n    language text,\n    subject text,\n    path text,\n    publishDate TIMESTAMP,\n    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n)`;\nconst insertBookQuery = `INSERT INTO book (\n    title, \n    author, \n    description, \n    language, \n    subject, \n    path,\n    publishDate\n    ) VALUES (?,?,?,?,?,?,?)`;\nconst deleteBookByIdQuery = `delete from book where id = ?`;\nconst getBookByIdQuery = `select * from book where id = ?`;\nconst getBooksQuery = `select * from book`;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvZXhwcmVzcy9kYXRhYmFzZS9xdWVyaWVzL2Jvb2suanM/MDY2NSJdLCJuYW1lcyI6WyJpbml0aWFsaXplQm9va1F1ZXJ5IiwiaW5zZXJ0Qm9va1F1ZXJ5IiwiZGVsZXRlQm9va0J5SWRRdWVyeSIsImdldEJvb2tCeUlkUXVlcnkiLCJnZXRCb29rc1F1ZXJ5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyxNQUFNQSxtQkFBbUIsR0FBSTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQVZPO0FBWUEsTUFBTUMsZUFBZSxHQUFJO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBUk87QUFVQSxNQUFNQyxtQkFBbUIsR0FBSSwrQkFBN0I7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBSSxpQ0FBMUI7QUFDQSxNQUFNQyxhQUFhLEdBQUksb0JBQXZCIiwiZmlsZSI6Ii4vcHVibGljL2V4cHJlc3MvZGF0YWJhc2UvcXVlcmllcy9ib29rLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGluaXRpYWxpemVCb29rUXVlcnkgPSBgY3JlYXRlIHRhYmxlIGlmIG5vdCBleGlzdHMgYm9vayAoXHJcbiAgICBpZCBJTlRFR0VSIFBSSU1BUlkgS0VZIEFVVE9JTkNSRU1FTlQsXHJcbiAgICB0aXRsZSB0ZXh0LFxyXG4gICAgYXV0aG9yIHRleHQsXHJcbiAgICBkZXNjcmlwdGlvbiB0ZXh0LFxyXG4gICAgbGFuZ3VhZ2UgdGV4dCxcclxuICAgIHN1YmplY3QgdGV4dCxcclxuICAgIHBhdGggdGV4dCxcclxuICAgIHB1Ymxpc2hEYXRlIFRJTUVTVEFNUCxcclxuICAgIGNyZWF0ZURhdGUgVElNRVNUQU1QIERFRkFVTFQgQ1VSUkVOVF9USU1FU1RBTVBcclxuKWA7XHJcblxyXG5leHBvcnQgY29uc3QgaW5zZXJ0Qm9va1F1ZXJ5ID0gYElOU0VSVCBJTlRPIGJvb2sgKFxyXG4gICAgdGl0bGUsIFxyXG4gICAgYXV0aG9yLCBcclxuICAgIGRlc2NyaXB0aW9uLCBcclxuICAgIGxhbmd1YWdlLCBcclxuICAgIHN1YmplY3QsIFxyXG4gICAgcGF0aCxcclxuICAgIHB1Ymxpc2hEYXRlXHJcbiAgICApIFZBTFVFUyAoPyw/LD8sPyw/LD8sPylgO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUJvb2tCeUlkUXVlcnkgPSBgZGVsZXRlIGZyb20gYm9vayB3aGVyZSBpZCA9ID9gO1xyXG5leHBvcnQgY29uc3QgZ2V0Qm9va0J5SWRRdWVyeSA9IGBzZWxlY3QgKiBmcm9tIGJvb2sgd2hlcmUgaWQgPSA/YDtcclxuZXhwb3J0IGNvbnN0IGdldEJvb2tzUXVlcnkgPSBgc2VsZWN0ICogZnJvbSBib29rYDtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./public/express/database/queries/book.js\n");

/***/ }),

/***/ "./public/express/server.js":
/*!**********************************!*\
  !*** ./public/express/server.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var epub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! epub */ \"epub\");\n/* harmony import */ var epub__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(epub__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _database_database__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./database/database */ \"./public/express/database/database.js\");\n/* harmony import */ var _database_queries_book__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./database/queries/book */ \"./public/express/database/queries/book.js\");\n\n\n\n\n\n\nconst server = express__WEBPACK_IMPORTED_MODULE_0___default()();\nserver.use(Object(body_parser__WEBPACK_IMPORTED_MODULE_2__[\"urlencoded\"])({\n  extended: false\n}));\nserver.use(Object(body_parser__WEBPACK_IMPORTED_MODULE_2__[\"json\"])());\nconst port = 5050;\n\nfunction createBookObject(title, author, description, language, subject, path, publishDate) {\n  return {\n    title,\n    author,\n    description,\n    language,\n    subject,\n    path,\n    publishDate\n  };\n}\n\nfunction createBookData(object) {\n  return [object.title, object.author, object.description, object.language, object.subject, object.path, object.publishDate];\n}\n\nserver.post(\"/book\", (req, res) => {\n  const {\n    title,\n    description,\n    language,\n    subject,\n    author,\n    publishDate,\n    path\n  } = req.body;\n  const bookObject = createBookObject(title, author, description, language, subject, path, publishDate);\n  const bookData = createBookData(bookObject); // Save book\n\n  _database_database__WEBPACK_IMPORTED_MODULE_4__[\"default\"].run(_database_queries_book__WEBPACK_IMPORTED_MODULE_5__[\"insertBookQuery\"], bookData, function (err, result) {\n    if (err) {\n      res.status(400).json({\n        error: err.message\n      });\n      return;\n    }\n\n    res.json({\n      message: \"success\",\n      data: bookData,\n      id: this.lastID\n    });\n  });\n  res.json(book);\n});\nserver.post(\"/book/path/:path\", (req, res) => {\n  // Decode path\n  const resolvedPath = Object(path__WEBPACK_IMPORTED_MODULE_1__[\"resolve\"])(decodeURIComponent(req.params.path)); // Get metadataimport EPub from 'epub'\n\n  const epub = new epub__WEBPACK_IMPORTED_MODULE_3___default.a(resolvedPath);\n  epub.on(\"end\", function () {\n    // epub is initialized now\n    const metadata = epub.metadata; // Creaate book record\n\n    const {\n      title,\n      creator,\n      description,\n      language,\n      subject\n    } = metadata;\n    const bookObject = createBookObject(title, creator, description, language, subject, resolvedPath, \"\");\n    const bookData = createBookData(bookObject); // Save book\n\n    _database_database__WEBPACK_IMPORTED_MODULE_4__[\"default\"].run(_database_queries_book__WEBPACK_IMPORTED_MODULE_5__[\"insertBookQuery\"], bookData, function (err, result) {\n      if (err) {\n        res.status(400).json({\n          error: err.message\n        });\n        return;\n      }\n\n      res.json({\n        message: \"success\",\n        data: bookObject,\n        id: this.lastID\n      });\n    });\n  });\n  epub.parse();\n});\nserver.delete(\"/book/:id\", (req, res, next) => {\n  var params = [req.params.id];\n  _database_database__WEBPACK_IMPORTED_MODULE_4__[\"default\"].run(_database_queries_book__WEBPACK_IMPORTED_MODULE_5__[\"deleteBookByIdQuery\"], params, (err, book) => {\n    if (err) {\n      res.status(400).json({\n        error: err.message\n      });\n      return;\n    }\n\n    res.json({\n      message: \"success\",\n      data: book\n    });\n  });\n});\nserver.get(\"/book\", (req, res) => {\n  var params = [];\n  _database_database__WEBPACK_IMPORTED_MODULE_4__[\"default\"].all(_database_queries_book__WEBPACK_IMPORTED_MODULE_5__[\"getBooksQuery\"], params, (err, books) => {\n    if (err) {\n      res.status(400).json({\n        error: err.message\n      });\n      return;\n    }\n\n    res.json({\n      message: \"success\",\n      data: books\n    });\n  });\n});\nserver.get(\"/book/:id\", (req, res) => {\n  var params = [req.params.id];\n  _database_database__WEBPACK_IMPORTED_MODULE_4__[\"default\"].get(_database_queries_book__WEBPACK_IMPORTED_MODULE_5__[\"getBookByIdQuery\"], params, (err, book) => {\n    if (err) {\n      res.status(400).json({\n        error: err.message\n      });\n      return;\n    }\n\n    res.json({\n      message: \"success\",\n      data: book\n    });\n  });\n});\nserver.get(\"/book/download/:path\", (req, res) => {\n  const resolvedPath = Object(path__WEBPACK_IMPORTED_MODULE_1__[\"resolve\"])(decodeURIComponent(req.params.path));\n  res.download(resolvedPath);\n});\nserver.listen(port, () => {\n  console.log(`App listening at http://localhost:${port}`);\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (server);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvZXhwcmVzcy9zZXJ2ZXIuanM/ODcwMiJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJleHByZXNzIiwidXNlIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwianNvbiIsInBvcnQiLCJjcmVhdGVCb29rT2JqZWN0IiwidGl0bGUiLCJhdXRob3IiLCJkZXNjcmlwdGlvbiIsImxhbmd1YWdlIiwic3ViamVjdCIsInBhdGgiLCJwdWJsaXNoRGF0ZSIsImNyZWF0ZUJvb2tEYXRhIiwib2JqZWN0IiwicG9zdCIsInJlcSIsInJlcyIsImJvZHkiLCJib29rT2JqZWN0IiwiYm9va0RhdGEiLCJkYiIsInJ1biIsImluc2VydEJvb2tRdWVyeSIsImVyciIsInJlc3VsdCIsInN0YXR1cyIsImVycm9yIiwibWVzc2FnZSIsImRhdGEiLCJpZCIsImxhc3RJRCIsImJvb2siLCJyZXNvbHZlZFBhdGgiLCJyZXNvbHZlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicGFyYW1zIiwiZXB1YiIsIkVQdWIiLCJvbiIsIm1ldGFkYXRhIiwiY3JlYXRvciIsInBhcnNlIiwiZGVsZXRlIiwibmV4dCIsImRlbGV0ZUJvb2tCeUlkUXVlcnkiLCJnZXQiLCJhbGwiLCJnZXRCb29rc1F1ZXJ5IiwiYm9va3MiLCJnZXRCb29rQnlJZFF1ZXJ5IiwiZG93bmxvYWQiLCJsaXN0ZW4iLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0EsTUFBTUEsTUFBTSxHQUFHQyw4Q0FBTyxFQUF0QjtBQUNBRCxNQUFNLENBQUNFLEdBQVAsQ0FBV0MsOERBQVUsQ0FBQztBQUFFQyxVQUFRLEVBQUU7QUFBWixDQUFELENBQXJCO0FBQ0FKLE1BQU0sQ0FBQ0UsR0FBUCxDQUFXRyx3REFBSSxFQUFmO0FBRUEsTUFBTUMsSUFBSSxH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YjtBQUNELENBSEQ7QUFLQW5DLE1BQU0sQ0FBQ3NELE1BQVAsQ0FBY2hELElBQWQsRUFBb0IsTUFBTTtBQUN4QmlELFNBQU8sQ0FBQ0MsR0FBUixDQUFhLHFDQUFvQ2xELElBQUssRUFBdEQ7QUFDRCxDQUZEO0FBSWVOLHFFQUFmIiwiZmlsZSI6Ii4vcHVibGljL2V4cHJlc3Mvc2VydmVyLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IHVybGVuY29kZWQsIGpzb24gfSBmcm9tIFwiYm9keS1wYXJzZXJcIjtcclxuaW1wb3J0IEVQdWIgZnJvbSBcImVwdWJcIjtcclxuaW1wb3J0IGRiIGZyb20gXCIuL2RhdGFiYXNlL2RhdGFiYXNlXCI7XHJcbmltcG9ydCB7XHJcbiAgZ2V0Qm9va0J5SWRRdWVyeSxcclxuICBnZXRCb29rc1F1ZXJ5LFxyXG4gIGluc2VydEJvb2tRdWVyeSxcclxuICBkZWxldGVCb29rQnlJZFF1ZXJ5LFxyXG59IGZyb20gXCIuL2RhdGFiYXNlL3F1ZXJpZXMvYm9va1wiO1xyXG5cclxuY29uc3Qgc2VydmVyID0gZXhwcmVzcygpO1xyXG5zZXJ2ZXIudXNlKHVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xyXG5zZXJ2ZXIudXNlKGpzb24oKSk7XHJcblxyXG5jb25zdCBwb3J0ID0gNTA1MDtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvb2tPYmplY3QoXHJcbiAgdGl0bGUsXHJcbiAgYXV0aG9yLFxyXG4gIGRlc2NyaXB0aW9uLFxyXG4gIGxhbmd1YWdlLFxyXG4gIHN1YmplY3QsXHJcbiAgcGF0aCxcclxuICBwdWJsaXNoRGF0ZVxyXG4pIHtcclxuICByZXR1cm4geyB0aXRsZSwgYXV0aG9yLCBkZXNjcmlwdGlvbiwgbGFuZ3VhZ2UsIHN1YmplY3QsIHBhdGgsIHB1Ymxpc2hEYXRlIH07XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlQm9va0RhdGEob2JqZWN0KSB7XHJcbiAgcmV0dXJuIFtcclxuICAgIG9iamVjdC50aXRsZSxcclxuICAgIG9iamVjdC5hdXRob3IsXHJcbiAgICBvYmplY3QuZGVzY3JpcHRpb24sXHJcbiAgICBvYmplY3QubGFuZ3VhZ2UsXHJcbiAgICBvYmplY3Quc3ViamVjdCxcclxuICAgIG9iamVjdC5wYXRoLFxyXG4gICAgb2JqZWN0LnB1Ymxpc2hEYXRlLFxyXG4gIF07XHJcbn1cclxuXHJcbnNlcnZlci5wb3N0KFwiL2Jvb2tcIiwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgdGl0bGUsXHJcbiAgICBkZXNjcmlwdGlvbixcclxuICAgIGxhbmd1YWdlLFxyXG4gICAgc3ViamVjdCxcclxuICAgIGF1dGhvcixcclxuICAgIHB1Ymxpc2hEYXRlLFxyXG4gICAgcGF0aCxcclxuICB9ID0gcmVxLmJvZHk7XHJcbiAgY29uc3QgYm9va09iamVjdCA9IGNyZWF0ZUJvb2tPYmplY3QoXHJcbiAgICB0aXRsZSxcclxuICAgIGF1dGhvcixcclxuICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgbGFuZ3VhZ2UsXHJcbiAgICBzdWJqZWN0LFxyXG4gICAgcGF0aCxcclxuICAgIHB1Ymxpc2hEYXRlXHJcbiAgKTtcclxuICBjb25zdCBib29rRGF0YSA9IGNyZWF0ZUJvb2tEYXRhKGJvb2tPYmplY3QpO1xyXG5cclxuICAvLyBTYXZlIGJvb2tcclxuICBkYi5ydW4oaW5zZXJ0Qm9va1F1ZXJ5LCBib29rRGF0YSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IGVyci5tZXNzYWdlIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICByZXMuanNvbih7XHJcbiAgICAgIG1lc3NhZ2U6IFwic3VjY2Vzc1wiLFxyXG4gICAgICBkYXRhOiBib29rRGF0YSxcclxuICAgICAgaWQ6IHRoaXMubGFzdElELFxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHJlcy5qc29uKGJvb2spO1xyXG59KTtcclxuXHJcbnNlcnZlci5wb3N0KFwiL2Jvb2svcGF0aC86cGF0aFwiLCAocmVxLCByZXMpID0+IHtcclxuICAvLyBEZWNvZGUgcGF0aFxyXG4gIGNvbnN0IHJlc29sdmVkUGF0aCA9IHJlc29sdmUoZGVjb2RlVVJJQ29tcG9uZW50KHJlcS5wYXJhbXMucGF0aCkpO1xyXG5cclxuICAvLyBHZXQgbWV0YWRhdGFpbXBvcnQgRVB1YiBmcm9tICdlcHViJ1xyXG4gIGNvbnN0IGVwdWIgPSBuZXcgRVB1YihyZXNvbHZlZFBhdGgpO1xyXG5cclxuICBlcHViLm9uKFwiZW5kXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGVwdWIgaXMgaW5pdGlhbGl6ZWQgbm93XHJcbiAgICBjb25zdCBtZXRhZGF0YSA9IGVwdWIubWV0YWRhdGE7XHJcblxyXG4gICAgLy8gQ3JlYWF0ZSBib29rIHJlY29yZFxyXG4gICAgY29uc3QgeyB0aXRsZSwgY3JlYXRvciwgZGVzY3JpcHRpb24sIGxhbmd1YWdlLCBzdWJqZWN0IH0gPSBtZXRhZGF0YTtcclxuICAgIGNvbnN0IGJvb2tPYmplY3QgPSBjcmVhdGVCb29rT2JqZWN0KFxyXG4gICAgICB0aXRsZSxcclxuICAgICAgY3JlYXRvcixcclxuICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgIGxhbmd1YWdlLFxyXG4gICAgICBzdWJqZWN0LFxyXG4gICAgICByZXNvbHZlZFBhdGgsXHJcbiAgICAgIFwiXCJcclxuICAgICk7XHJcbiAgICBjb25zdCBib29rRGF0YSA9IGNyZWF0ZUJvb2tEYXRhKGJvb2tPYmplY3QpO1xyXG5cclxuICAgIC8vIFNhdmUgYm9va1xyXG4gICAgZGIucnVuKGluc2VydEJvb2tRdWVyeSwgYm9va0RhdGEsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICBtZXNzYWdlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICBkYXRhOiBib29rT2JqZWN0LFxyXG4gICAgICAgIGlkOiB0aGlzLmxhc3RJRCxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZXB1Yi5wYXJzZSgpO1xyXG59KTtcclxuXHJcbnNlcnZlci5kZWxldGUoXCIvYm9vay86aWRcIiwgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgdmFyIHBhcmFtcyA9IFtyZXEucGFyYW1zLmlkXTtcclxuICBkYi5ydW4oZGVsZXRlQm9va0J5SWRRdWVyeSwgcGFyYW1zLCAoZXJyLCBib29rKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IGVyci5tZXNzYWdlIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICByZXMuanNvbih7XHJcbiAgICAgIG1lc3NhZ2U6IFwic3VjY2Vzc1wiLFxyXG4gICAgICBkYXRhOiBib29rLFxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuc2VydmVyLmdldChcIi9ib29rXCIsIChyZXEsIHJlcykgPT4ge1xyXG4gIHZhciBwYXJhbXMgPSBbXTtcclxuICBkYi5hbGwoZ2V0Qm9va3NRdWVyeSwgcGFyYW1zLCAoZXJyLCBib29rcykgPT4ge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBlcnIubWVzc2FnZSB9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgcmVzLmpzb24oe1xyXG4gICAgICBtZXNzYWdlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgZGF0YTogYm9va3MsXHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7XHJcblxyXG5zZXJ2ZXIuZ2V0KFwiL2Jvb2svOmlkXCIsIChyZXEsIHJlcykgPT4ge1xyXG4gIHZhciBwYXJhbXMgPSBbcmVxLnBhcmFtcy5pZF07XHJcbiAgZGIuZ2V0KGdldEJvb2tCeUlkUXVlcnksIHBhcmFtcywgKGVyciwgYm9vaykgPT4ge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBlcnIubWVzc2FnZSB9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgcmVzLmpzb24oe1xyXG4gICAgICBtZXNzYWdlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgZGF0YTogYm9vayxcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbnNlcnZlci5nZXQoXCIvYm9vay9kb3dubG9hZC86cGF0aFwiLCAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCByZXNvbHZlZFBhdGggPSByZXNvbHZlKGRlY29kZVVSSUNvbXBvbmVudChyZXEucGFyYW1zLnBhdGgpKTtcclxuICByZXMuZG93bmxvYWQocmVzb2x2ZWRQYXRoKTtcclxufSk7XHJcblxyXG5zZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IHtcclxuICBjb25zb2xlLmxvZyhgQXBwIGxpc3RlbmluZyBhdCBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH1gKTtcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./public/express/server.js\n");

/***/ }),

/***/ "./public/main.js":
/*!************************!*\
  !*** ./public/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction createWindow() {\n  __webpack_require__(/*! ./express/server */ \"./public/express/server.js\").default; // Create the browser window.\n\n  const win = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"]({\n    minHeight: 400,\n    minWidth: 400,\n    width: 1600,\n    height: 1200,\n    webPreferences: {\n      nodeIntegration: true,\n      enableRemoteModule: true,\n      webSecurity: false\n    }\n  }); //load the index.html from a url\n\n  win.loadURL(\"http://localhost:3000\");\n  win.removeMenu(); // Open the DevTools.\n\n  win.webContents.openDevTools();\n} // This method will be called when Electron has finished\n// initialization and is ready to create browser windows.\n// Some APIs can only be used after this event occurs.\n\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].whenReady().then(createWindow); // Quit when all windows are closed, except on macOS. There, it's common\n// for applications and their menu bar to stay active until the user quits\n// explicitly with Cmd + Q.\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on(\"window-all-closed\", () => {\n  if (process.platform !== \"darwin\") {\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n  }\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on(\"activate\", () => {\n  // On macOS it's common to re-create a window in the app when the\n  // dock icon is clicked and there are no other windows open.\n  if (electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getAllWindows().length === 0) {\n    createWindow();\n  }\n}); // In this file you can include the rest of your app's specific main process\n// code. You can also put them in separate files and require them here.//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvbWFpbi5qcz85MmIyIl0sIm5hbWVzIjpbImNyZWF0ZVdpbmRvdyIsInJlcXVpcmUiLCJkZWZhdWx0Iiwid2luIiwiQnJvd3NlcldpbmRvdyIsIm1pbkhlaWdodCIsIm1pbldpZHRoIiwid2lkdGgiLCJoZWlnaHQiLCJ3ZWJQcmVmZXJlbmNlcyIsIm5vZGVJbnRlZ3JhdGlvbiIsImVuYWJsZVJlbW90ZU1vZHVsZSIsIndlYlNlY3VyaXR5IiwibG9hZFVSTCIsInJlbW92ZU1lbnUiLCJ3ZWJDb250ZW50cyIsIm9wZW5EZXZUb29scyIsImFwcCIsIndoZW5SZWFkeSIsInRoZW4iLCJvbiIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsInF1aXQiLCJnZXRBbGxXaW5kb3dzIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFQSxTQUFTQSxZQUFULEdBQXdCO0FBQ3RCQyxxQkFBTyxDQUFDLG9EQUFELENBQVAsQ0FBNEJDLE9BQTVCLENBRHNCLENBR3RCOztBQUNBLFFBQU1DLEdBQUcsR0FBRyxJQUFJQyxzREFBSixDQUFrQjtBQUM1QkMsYUFBUyxFQUFFLEdBRGlCO0FBRTVCQyxZQUFRLEVBQUUsR0FGa0I7QUFHNUJDLFNBQUssRUFBRSxJQUhxQjtBQUk1QkMsVUFBTSxFQUFFLElBSm9CO0FBSzVCQyxrQkFBYyxFQUFFO0FBQ2RDLHFCQUFlLEVBQUUsSUFESDtBQUVkQyx3QkFBa0IsRUFBRSxJQUZOO0FBR2RDLGlCQUFXLEVBQUU7QUFIQztBQUxZLEdBQWxCLENBQVosQ0FKc0IsQ0FnQnRCOztBQUNBVCxLQUFHLENBQUNVLE9BQUosQ0FBWSx1QkFBWjtBQUVBVixLQUFHLENBQUNXLFVBQUosR0FuQnNCLENBcUJ0Qjs7QUFDQVgsS0FBRyxDQUFDWSxXQUFKLENBQWdCQyxZQUFoQjtBQUNELEMsQ0FFRDtBQUNBO0FBQ0E7OztBQUNBQyw0Q0FBRyxDQUFDQyxTQUFKLEdBQWdCQyxJQUFoQixDQUFxQm5CLFlBQXJCLEUsQ0FFQTtBQUNBO0FBQ0E7O0FBQ0FpQiw0Q0FBRyxDQUFDRyxFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQyxNQUFJQyxPQUFPLENBQUNDLFFBQVIsS0FBcUIsUUFBekIsRUFBbUM7QUFDakNMLGdEQUFHLENBQUNNLElBQUo7QUFDRDtBQUNGLENBSkQ7QUFNQU4sNENBQUcsQ0FBQ0csRUFBSixDQUFPLFVBQVAsRUFBbUIsTUFBTTtBQUN2QjtBQUNBO0FBRUEsTUFBSWhCLHNEQUFhLENBQUNvQixhQUFkLEdBQThCQyxNQUE5QixLQUF5QyxDQUE3QyxFQUFnRDtBQUM5Q3pCLGdCQUFZO0FBQ2I7QUFDRixDQVBELEUsQ0FTQTtBQUNBIiwiZmlsZSI6Ii4vcHVibGljL21haW4uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3cgfSBmcm9tIFwiZWxlY3Ryb25cIjtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcclxuICByZXF1aXJlKFwiLi9leHByZXNzL3NlcnZlclwiKS5kZWZhdWx0O1xyXG5cclxuICAvLyBDcmVhdGUgdGhlIGJyb3dzZXIgd2luZG93LlxyXG4gIGNvbnN0IHdpbiA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgIG1pbkhlaWdodDogNDAwLFxyXG4gICAgbWluV2lkdGg6IDQwMCxcclxuICAgIHdpZHRoOiAxNjAwLFxyXG4gICAgaGVpZ2h0OiAxMjAwLFxyXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcclxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxyXG4gICAgICBlbmFibGVSZW1vdGVNb2R1bGU6IHRydWUsXHJcbiAgICAgIHdlYlNlY3VyaXR5OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIC8vbG9hZCB0aGUgaW5kZXguaHRtbCBmcm9tIGEgdXJsXHJcbiAgd2luLmxvYWRVUkwoXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIik7XHJcblxyXG4gIHdpbi5yZW1vdmVNZW51KCk7XHJcblxyXG4gIC8vIE9wZW4gdGhlIERldlRvb2xzLlxyXG4gIHdpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcclxufVxyXG5cclxuLy8gVGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgd2hlbiBFbGVjdHJvbiBoYXMgZmluaXNoZWRcclxuLy8gaW5pdGlhbGl6YXRpb24gYW5kIGlzIHJlYWR5IHRvIGNyZWF0ZSBicm93c2VyIHdpbmRvd3MuXHJcbi8vIFNvbWUgQVBJcyBjYW4gb25seSBiZSB1c2VkIGFmdGVyIHRoaXMgZXZlbnQgb2NjdXJzLlxyXG5hcHAud2hlblJlYWR5KCkudGhlbihjcmVhdGVXaW5kb3cpO1xyXG5cclxuLy8gUXVpdCB3aGVuIGFsbCB3aW5kb3dzIGFyZSBjbG9zZWQsIGV4Y2VwdCBvbiBtYWNPUy4gVGhlcmUsIGl0J3MgY29tbW9uXHJcbi8vIGZvciBhcHBsaWNhdGlvbnMgYW5kIHRoZWlyIG1lbnUgYmFyIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzXHJcbi8vIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRLlxyXG5hcHAub24oXCJ3aW5kb3ctYWxsLWNsb3NlZFwiLCAoKSA9PiB7XHJcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09IFwiZGFyd2luXCIpIHtcclxuICAgIGFwcC5xdWl0KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+IHtcclxuICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxyXG4gIC8vIGRvY2sgaWNvbiBpcyBjbGlja2VkIGFuZCB0aGVyZSBhcmUgbm8gb3RoZXIgd2luZG93cyBvcGVuLlxyXG5cclxuICBpZiAoQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICBjcmVhdGVXaW5kb3coKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gSW4gdGhpcyBmaWxlIHlvdSBjYW4gaW5jbHVkZSB0aGUgcmVzdCBvZiB5b3VyIGFwcCdzIHNwZWNpZmljIG1haW4gcHJvY2Vzc1xyXG4vLyBjb2RlLiBZb3UgY2FuIGFsc28gcHV0IHRoZW0gaW4gc2VwYXJhdGUgZmlsZXMgYW5kIHJlcXVpcmUgdGhlbSBoZXJlLlxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./public/main.js\n");

/***/ }),

/***/ 0:
/*!*********************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./public/main.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! H:\Repositories\electron-reader\node_modules\electron-webpack\out\electron-main-hmr\main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
module.exports = __webpack_require__(/*! H:\Repositories\electron-reader\public\main.js */"./public/main.js");


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJib2R5LXBhcnNlclwiPzgxODgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiYm9keS1wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///body-parser\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "epub":
/*!***********************!*\
  !*** external "epub" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"epub\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlcHViXCI/MjFhMyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJlcHViLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXB1YlwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///epub\n");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCI/MjJmZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJleHByZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///express\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"sqlite3\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzcWxpdGUzXCI/Y2MzMyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzcWxpdGUzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3FsaXRlM1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///sqlite3\n");

/***/ })

/******/ });