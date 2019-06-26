using Agenda.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Agenda.Controllers
{
    [Route("api/[controller]/[action]/")]
    public class AgendaController : ControllerBase
    {
        private readonly AgendasContext context;

        public AgendaController(AgendasContext context)
        {
            this.context = context;
        }


        [HttpGet]
        public async Task<ActionResult<bool>> GetAll()
        {
            try
            {
                var agendas = await this.context.Agenda.ToListAsync();
                return Ok(agendas);
            }
            catch (Exception e)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        public async Task<ActionResult<bool>> GetAgendaById([FromQuery]int idAgenda)
        {
            try
            {
                if (idAgenda == 0)
                    return this.BadRequest();

                return Ok(await this.context.Agenda.FirstOrDefaultAsync(x => x.Id == idAgenda));

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut]
        public async Task<ActionResult<bool>> Update([FromBody]Models.Agenda agenda)
        {
            try
            {
                if (agenda == null && agenda.Id <= 0)
                    return this.BadRequest();

                var agendaDb = await this.context.Agenda.FirstOrDefaultAsync(x => x.Id == agenda.Id);

                if (agendaDb == null)
                {
                    return Ok(new MessageResponse<Models.Agenda>(new Error { IsError = true }));
                }

                agendaDb.FirstName = agenda.FirstName;
                agendaDb.LastName = agenda.LastName;
                agendaDb.Photo = agenda.Photo;
                agendaDb.SecondLastName = agenda.SecondLastName;
                agendaDb.Phone = agenda.Phone;
                this.context.Update(agendaDb);
                var response = await this.context.SaveChangesAsync() > 0 ? new MessageResponse<Models.Agenda>(agendaDb) : new MessageResponse<Models.Agenda>(new Error { IsError = true });

                return Ok(response);
            }
            catch (Exception e)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> Delete([FromQuery]int idAgenda)
        {
            try
            {
                if (idAgenda == 0)
                    return this.BadRequest();

                var agendaDb = await this.context.Agenda.FirstOrDefaultAsync(x => x.Id == idAgenda);

                if (agendaDb == null)
                {
                    return Ok(new MessageResponse<Models.Agenda>(new Error { IsError = true }));
                }

                this.context.Agenda.Remove(agendaDb);

                var response = await this.context.SaveChangesAsync() > 0 ? new MessageResponse<Models.Agenda>(agendaDb) : new MessageResponse<Models.Agenda>(new Error { IsError = true });

                return Ok(response);
            }
            catch (Exception e)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);

            }
        }

        [HttpPost]
        public async Task<ActionResult<bool>> Create([FromBody]Models.Agenda agenda)
        {
            try
            {
                if (agenda == null)
                    return this.BadRequest();

                this.context.Agenda.Add(agenda);

                var response = await this.context.SaveChangesAsync() > 0 ? new MessageResponse<Models.Agenda>(agenda) : new MessageResponse<Models.Agenda>(new Error { IsError = true });
                return Ok(response);
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<ActionResult<bool>> Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
